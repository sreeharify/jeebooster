-- ============================================================
--  IELTS Master — Supabase Database Schema  (Google OAuth)
--  Run this in Supabase SQL Editor → New Query → Run
--  Safe to re-run on an existing database (idempotent)
-- ============================================================

-- 1. PROFILES TABLE
-- Note: NO gems, NO hearts — removed intentionally
create table if not exists public.profiles (
  id                uuid references auth.users on delete cascade primary key,
  username          text not null default 'Learner',
  email             text,
  google_avatar     text,
  xp                integer default 0,
  xp_today          integer default 0,
  level             integer default 1,
  streak            integer default 0,
  daily_goal        integer default 100,
  last_activity     timestamp with time zone,
  completed_lessons text[]  default '{}',
  achievements      text[]  default '{}',
  created_at        timestamp with time zone default now()
);

-- If upgrading an existing DB that has gems/hearts/avatar columns, drop them:
alter table public.profiles drop column if exists gems;
alter table public.profiles drop column if exists hearts;
alter table public.profiles drop column if exists avatar;

-- 2. LESSON ATTEMPTS
create table if not exists public.lesson_attempts (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references public.profiles(id) on delete cascade,
  lesson_id    text not null,
  score        integer default 0,
  completed_at timestamp with time zone default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles        enable row level security;
alter table public.lesson_attempts enable row level security;

-- Drop and recreate all policies cleanly
drop policy if exists "Profiles are publicly readable"    on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Profiles are publicly readable"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

drop policy if exists "Users can view own attempts"   on public.lesson_attempts;
drop policy if exists "Users can insert own attempts" on public.lesson_attempts;

create policy "Users can view own attempts"
  on public.lesson_attempts for select using (auth.uid() = user_id);

create policy "Users can insert own attempts"
  on public.lesson_attempts for insert with check (auth.uid() = user_id);

-- ============================================================
-- TRIGGER — auto-create profile on first Google sign-in
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, google_avatar)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1),
      'Learner'
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists profiles_xp_idx     on public.profiles(xp desc);
create index if not exists profiles_streak_idx on public.profiles(streak desc);
create index if not exists attempts_user_idx   on public.lesson_attempts(user_id);
