-- Schema for the offer-sharing + lead-capture features (Neon / Postgres).
-- Applied to the "Portfolio" Neon project. Re-runnable (IF NOT EXISTS).
--
-- The app talks to the DB via the Neon serverless driver using DATABASE_URL
-- (the postgres:// connection string), so no RLS/Data API setup is required —
-- access is server-side only, through the Vercel functions.

create table if not exists portfolio_offers (
  id         text primary key,             -- short share id (used in /tarjous/<id>)
  title      text not null,
  company    text,
  language   text not null default 'fi',
  data       jsonb not null,               -- the full Offer object
  created_at timestamptz not null default now()
);
create index if not exists portfolio_offers_created_idx on portfolio_offers (created_at desc);

create table if not exists portfolio_leads (
  id         bigint generated always as identity primary key,
  name       text not null,
  email      text not null,
  company    text,
  message    text not null,
  source     text,                          -- where the lead came from (e.g. 'yhteys')
  created_at timestamptz not null default now()
);
create index if not exists portfolio_leads_created_idx on portfolio_leads (created_at desc);

alter table portfolio_leads add column if not exists marketing_consent boolean not null default false;
alter table portfolio_leads add column if not exists consent_at timestamptz;
