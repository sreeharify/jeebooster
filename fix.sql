-- ================================================================
--  IELTSdua — fix.sql
--  Run this in Supabase → SQL Editor → New Query → Run
--  Fixes:
--    1. daily xp_today reset — adds last_xp_reset column so the
--       server always knows which calendar day was last reset
--    2. Backfills the column for all existing users
--    3. Adds a Postgres function you can call from a cron job or
--       manually to reset everyone at midnight
-- ================================================================

-- ----------------------------------------------------------------
-- 1. Add the new column (safe if already exists)
-- ----------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_xp_reset date DEFAULT CURRENT_DATE;

-- ----------------------------------------------------------------
-- 2. Backfill existing rows:
--    - If last_activity is today → keep xp_today as-is, set reset date to today
--    - If last_activity was a previous day → reset xp_today to 0
-- ----------------------------------------------------------------
UPDATE public.profiles
SET
  xp_today       = 0,
  last_xp_reset  = CURRENT_DATE
WHERE
  last_activity IS NOT NULL
  AND last_activity::date < CURRENT_DATE
  AND COALESCE(xp_today, 0) > 0;

UPDATE public.profiles
SET last_xp_reset = CURRENT_DATE
WHERE last_xp_reset IS NULL;

-- ----------------------------------------------------------------
-- 3. Create a function to reset daily XP for all users
--    whose last_xp_reset is before today.
--    You can call this manually any time, or set up a cron job.
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.reset_daily_xp()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET
    xp_today      = 0,
    last_xp_reset = CURRENT_DATE
  WHERE
    COALESCE(last_xp_reset, '1970-01-01'::date) < CURRENT_DATE;

  RAISE NOTICE 'Daily XP reset complete at %', now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------
-- 4. Optional: schedule daily reset at midnight UTC using pg_cron
--    Uncomment the lines below if pg_cron is enabled on your
--    Supabase plan (Pro plan and above).
--
--    To enable pg_cron in Supabase:
--    Dashboard → Database → Extensions → search "pg_cron" → Enable
-- ----------------------------------------------------------------
-- SELECT cron.unschedule('reset-daily-xp');
-- SELECT cron.schedule(
--   'reset-daily-xp',           -- job name
--   '0 0 * * *',                -- cron expression: midnight UTC every day
--   'SELECT public.reset_daily_xp()'
-- );

-- ----------------------------------------------------------------
-- 5. Run the reset right now to fix any stale xp_today values
-- ----------------------------------------------------------------
SELECT public.reset_daily_xp();

-- ----------------------------------------------------------------
-- 6. Verify — shows each user's current state after migration
-- ----------------------------------------------------------------
SELECT
  username,
  xp,
  xp_today,
  last_xp_reset,
  last_activity::date AS last_active_date,
  CASE
    WHEN last_xp_reset = CURRENT_DATE THEN '✅ reset today'
    ELSE '⚠️ needs reset'
  END AS reset_status
FROM public.profiles
ORDER BY created_at DESC;

