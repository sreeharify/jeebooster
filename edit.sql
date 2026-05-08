-- ================================================================
--  JeeBooster — DATABASE MIGRATION / REPAIR SCRIPT
--  Paste this entire file into Supabase → SQL Editor → Run
--
--  Safe to run multiple times. Fixes ALL known issues:
--  • Removes stale columns (gems, hearts, avatar)
--  • Adds any missing columns (xp_today, google_avatar, etc.)
--  • Repairs broken RLS policies
--  • Fixes the user-creation trigger
--  • Patches existing rows that have NULL / wrong values
--  • Repairs any profiles row where username = 'Learner' and the
--    real name is available in auth.users metadata
-- ================================================================


-- ----------------------------------------------------------------
-- STEP 1 — Remove columns that no longer exist in the app
-- (safe — IF EXISTS means no error if already gone)
-- ----------------------------------------------------------------
ALTER TABLE public.profiles DROP COLUMN IF EXISTS gems;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS hearts;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS avatar;

-- ----------------------------------------------------------------
-- STEP 2 — Add any missing columns the app now expects
-- (safe — IF NOT EXISTS means no error if already there)
-- ----------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS google_avatar    text,
  ADD COLUMN IF NOT EXISTS xp_today        integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS xp              integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level           integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS streak          integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS daily_goal      integer DEFAULT 100,
  ADD COLUMN IF NOT EXISTS last_activity   timestamp with time zone,
  ADD COLUMN IF NOT EXISTS completed_lessons text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS achievements    text[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS created_at      timestamp with time zone DEFAULT now();

-- ----------------------------------------------------------------
-- STEP 3 — Fix NULL values in existing rows so the app
--           never sees NULL where it expects a number or array
-- ----------------------------------------------------------------
UPDATE public.profiles SET
  xp                = COALESCE(xp, 0),
  xp_today          = COALESCE(xp_today, 0),
  level             = COALESCE(level, 1),
  streak            = COALESCE(streak, 0),
  daily_goal        = COALESCE(daily_goal, 100),
  completed_lessons = COALESCE(completed_lessons, '{}'),
  achievements      = COALESCE(achievements, '{}')
WHERE
  xp IS NULL OR
  xp_today IS NULL OR
  level IS NULL OR
  streak IS NULL OR
  daily_goal IS NULL OR
  completed_lessons IS NULL OR
  achievements IS NULL;

-- ----------------------------------------------------------------
-- STEP 4 — Patch profiles that still show "Learner" as username
--           by pulling the real name from Google sign-in metadata
-- ----------------------------------------------------------------
UPDATE public.profiles p
SET
  username = COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    split_part(au.email, '@', 1),
    'Learner'
  ),
  google_avatar = COALESCE(
    p.google_avatar,
    au.raw_user_meta_data->>'avatar_url',
    au.raw_user_meta_data->>'picture'
  ),
  email = COALESCE(p.email, au.email)
FROM auth.users au
WHERE p.id = au.id
  AND (
    p.username = 'Learner'
    OR p.username IS NULL
    OR p.google_avatar IS NULL
  );

-- ----------------------------------------------------------------
-- STEP 5 — Create profile rows for any auth users that somehow
--           have NO row in profiles yet (should not happen but
--           this catches any edge cases)
-- ----------------------------------------------------------------
INSERT INTO public.profiles (id, email, username, google_avatar)
SELECT
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    split_part(au.email, '@', 1),
    'Learner'
  ),
  COALESCE(
    au.raw_user_meta_data->>'avatar_url',
    au.raw_user_meta_data->>'picture'
  )
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
);

-- ----------------------------------------------------------------
-- STEP 6 — Repair RLS policies
--           Drop all old versions (any name) and recreate cleanly
-- ----------------------------------------------------------------
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE tablename = 'profiles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
  END LOOP;

  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE tablename = 'lesson_attempts' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.lesson_attempts', pol.policyname);
  END LOOP;
END $$;

-- Re-enable RLS (idempotent)
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_attempts ENABLE ROW LEVEL SECURITY;

-- profiles policies
CREATE POLICY "public_read_profiles"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "users_insert_own_profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- lesson_attempts policies
CREATE POLICY "users_read_own_attempts"
  ON public.lesson_attempts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_attempts"
  ON public.lesson_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- STEP 7 — Recreate the trigger that auto-creates a profile row
--           when a new Google user signs in for the first time
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, google_avatar)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1),
      'Learner'
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ----------------------------------------------------------------
-- STEP 8 — Ensure lesson_attempts table exists
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lesson_attempts (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id    text NOT NULL,
  score        integer DEFAULT 0,
  completed_at timestamp with time zone DEFAULT now()
);

-- ----------------------------------------------------------------
-- STEP 9 — Indexes (idempotent)
-- ----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS profiles_xp_idx      ON public.profiles(xp DESC);
CREATE INDEX IF NOT EXISTS profiles_streak_idx  ON public.profiles(streak DESC);
CREATE INDEX IF NOT EXISTS attempts_user_idx    ON public.lesson_attempts(user_id);

-- ----------------------------------------------------------------
-- STEP 10 — Quick verification: show what your profiles look like
--            after the migration (you should see real names + avatars)
-- ----------------------------------------------------------------
SELECT
  id,
  username,
  email,
  CASE WHEN google_avatar IS NOT NULL THEN '✅ has photo' ELSE '❌ no photo' END AS avatar_status,
  xp,
  streak,
  level,
  daily_goal,
  array_length(completed_lessons, 1) AS lessons_done,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

