-- CardIQ Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── USER CARDS ───────────────────────────────────────────────────
-- Stores which cards each user has added
create table if not exists public.user_cards (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  card_id     text not null,           -- e.g. "amex-gold", "chase-sapphire-preferred"
  added_at    timestamptz default now(),
  is_active   boolean default true,
  unique(user_id, card_id)
);

-- Row-level security: users can only see/edit their own rows
alter table public.user_cards enable row level security;

create policy "Users can view own cards"
  on public.user_cards for select
  using (auth.uid() = user_id);

create policy "Users can insert own cards"
  on public.user_cards for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cards"
  on public.user_cards for update
  using (auth.uid() = user_id);

-- ─── USER BENEFIT TRACKING ────────────────────────────────────────
-- Tracks whether each benefit has been used
create table if not exists public.user_benefit_tracking (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  benefit_id    text not null,         -- matches CardBenefit.id in mock data
  status        text not null check (status in ('unused', 'partial', 'used', 'expired'))
                default 'unused',
  amount_used   integer default 0,     -- dollar amount used (for partial benefits)
  last_updated  timestamptz default now(),
  notes         text,
  unique(user_id, benefit_id)
);

alter table public.user_benefit_tracking enable row level security;

create policy "Users can view own benefit tracking"
  on public.user_benefit_tracking for select
  using (auth.uid() = user_id);

create policy "Users can insert own benefit tracking"
  on public.user_benefit_tracking for insert
  with check (auth.uid() = user_id);

create policy "Users can update own benefit tracking"
  on public.user_benefit_tracking for update
  using (auth.uid() = user_id);

create policy "Users can upsert own benefit tracking"
  on public.user_benefit_tracking for insert
  with check (auth.uid() = user_id);

-- ─── NOTIFICATIONS ────────────────────────────────────────────────
-- Stores notifications for each user
create table if not exists public.notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        text not null,
  title       text not null,
  body        text not null,
  benefit_id  text,
  card_id     text,
  created_at  timestamptz default now(),
  read_at     timestamptz
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- ─── INDEXES ──────────────────────────────────────────────────────
create index if not exists idx_user_cards_user_id on public.user_cards(user_id);
create index if not exists idx_user_benefit_tracking_user_id on public.user_benefit_tracking(user_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_created_at on public.notifications(created_at desc);
