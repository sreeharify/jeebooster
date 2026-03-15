-- ============================================================
--  IELTS Master — Supabase Database Schema  (Google OAuth)
--  Run this in Supabase SQL Editor → New Query → Run
-- ============================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id               uuid references auth.users on delete cascade primary key,
  username         text not null default 'Learner',
  email            text,
  avatar           text default '🦁',
  google_avatar    text,          -- URL from Google profile picture
  xp               integer default 0,
  xp_today         integer default 0,
  level            integer default 1,
  streak           integer default 0,
  gems             integer default 50,
  hearts           integer default 5,
  daily_goal       integer default 100,
  last_activity    timestamp with time zone,
  completed_lessons text[] default '{}',
  achievements      text[] default '{}',
  created_at        timestamp with time zone default now()
);

-- 2. LESSON ATTEMPTS
create table if not exists public.lesson_attempts (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references public.profiles(id) on delete cascade,
  lesson_id    text not null,
  score        integer default 0,
  completed_at timestamp with time zone default now()
);

-- 3. VOCAB PROGRESS
create table if not exists public.vocab_progress (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references public.profiles(id) on delete cascade,
  word          text not null,
  seen_count    integer default 1,
  correct_count integer default 0,
  last_seen     timestamp with time zone default now()
);

-- 4. WRITING SUBMISSIONS
create table if not exists public.writing_submissions (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references public.profiles(id) on delete cascade,
  topic_id     text,
  task_type    text,
  content      text,
  word_count   integer,
  submitted_at timestamp with time zone default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles           enable row level security;
alter table public.lesson_attempts    enable row level security;
alter table public.vocab_progress     enable row level security;
alter table public.writing_submissions enable row level security;

-- Profiles: anyone can read (leaderboard), only owner can write
drop policy if exists "Profiles are publicly readable"   on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Profiles are publicly readable"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Lesson attempts
drop policy if exists "Users can view own attempts"  on public.lesson_attempts;
drop policy if exists "Users can insert own attempts" on public.lesson_attempts;

create policy "Users can view own attempts"
  on public.lesson_attempts for select using (auth.uid() = user_id);

create policy "Users can insert own attempts"
  on public.lesson_attempts for insert with check (auth.uid() = user_id);

-- Vocab
drop policy if exists "Users can manage own vocab progress" on public.vocab_progress;
create policy "Users can manage own vocab progress"
  on public.vocab_progress for all using (auth.uid() = user_id);

-- Writing
drop policy if exists "Users can manage own writing" on public.writing_submissions;
create policy "Users can manage own writing"
  on public.writing_submissions for all using (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: auto-create a profile row on first Google sign-in
-- (The client also upserts, so this is a safety net)
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
  on conflict (id) do nothing;   -- never overwrite existing rows
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
create index if not exists profiles_streak_idx  on public.profiles(streak desc);
create index if not exists attempts_user_idx    on public.lesson_attempts(user_id);

-- ============================================================
-- V4 MIGRATION: remove gems & hearts columns if they exist
-- Run this AFTER the main schema if upgrading an existing DB
-- ============================================================
ALTER TABLE public.profiles DROP COLUMN IF EXISTS gems;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS hearts;
