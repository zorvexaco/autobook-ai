-- =============================================================================
-- AutoBook AI — Supabase PostgreSQL Schema
-- =============================================================================
-- This file contains the complete database schema including:
--   1. Extensions
--   2. Helper functions (ownership lookup, updated_at trigger)
--   3. All tables with proper data types and constraints
--   4. Foreign key relationships
--   5. Indexes on commonly queried columns
--   6. Row Level Security (RLS) policies
--   7. Triggers for automatic updated_at timestamps
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "uuid-ossp" with schema extensions;

-- ---------------------------------------------------------------------------
-- 1. Helper: trigger function to auto-set updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Helper: return the set of business IDs the current user owns
--    Used by every RLS policy so the logic lives in one place.
-- ---------------------------------------------------------------------------
create or replace function public.get_my_business_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.businesses where owner_id = auth.uid();
$$;

-- =========================================================================
-- TABLES
-- =========================================================================

-- ---------------------------------------------------------------------------
-- businesses
-- ---------------------------------------------------------------------------
create table public.businesses (
  id                  uuid primary key default uuid_generate_v4(),
  owner_id            uuid not null references auth.users (id) on delete cascade,
  name                text not null,
  business_type       text not null,
  phone               text,
  email               text,
  website             text,
  city                text,
  state               text,
  address             text,
  timezone            text not null default 'America/New_York',
  logo_url            text,
  stripe_customer_id  text,
  subscription_plan   text not null default 'free',
  subscription_status text not null default 'trialing',
  trial_ends_at       timestamptz,
  onboarding_completed boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_businesses_owner_id on public.businesses (owner_id);

-- ---------------------------------------------------------------------------
-- business_hours
-- ---------------------------------------------------------------------------
create table public.business_hours (
  id           uuid primary key default uuid_generate_v4(),
  business_id  uuid not null references public.businesses (id) on delete cascade,
  day_of_week  integer not null check (day_of_week between 0 and 6),
  open_time    time,
  close_time   time,
  is_open      boolean not null default true,
  created_at   timestamptz not null default now()
);

create index idx_business_hours_business_id on public.business_hours (business_id);

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
create table public.services (
  id               uuid primary key default uuid_generate_v4(),
  business_id      uuid not null references public.businesses (id) on delete cascade,
  name             text not null,
  description      text,
  price_cents      integer not null default 0,
  duration_minutes integer not null,
  is_bookable      boolean not null default true,
  is_active        boolean not null default true,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_services_business_id on public.services (business_id);

-- ---------------------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------------------
create table public.customers (
  id                  uuid primary key default uuid_generate_v4(),
  business_id         uuid not null references public.businesses (id) on delete cascade,
  first_name          text not null,
  last_name           text not null,
  phone               text not null,
  email               text,
  source              text not null default 'manual',
  first_contact_date  date not null default current_date,
  total_appointments  integer not null default 0,
  total_revenue_cents integer not null default 0,
  last_visit_date     date,
  notes               text,
  tags                text[] not null default '{}',
  sms_consent         boolean not null default false,
  review_requested    boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_customers_business_id on public.customers (business_id);
create index idx_customers_phone on public.customers (business_id, phone);
create index idx_customers_email on public.customers (business_id, email);

-- ---------------------------------------------------------------------------
-- appointments
-- ---------------------------------------------------------------------------
create table public.appointments (
  id                  uuid primary key default uuid_generate_v4(),
  business_id         uuid not null references public.businesses (id) on delete cascade,
  customer_id         uuid not null references public.customers (id) on delete cascade,
  service_id          uuid not null references public.services (id) on delete restrict,
  provider_id         uuid,
  scheduled_date      date not null,
  scheduled_time      time not null,
  duration_minutes    integer not null,
  status              text not null default 'scheduled',
  source              text not null default 'manual',
  reminder_sent       boolean not null default false,
  confirmation_status text not null default 'pending',
  notes               text,
  cancelled_at        timestamptz,
  cancellation_reason text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_appointments_business_id on public.appointments (business_id);
create index idx_appointments_customer_id on public.appointments (customer_id);
create index idx_appointments_service_id on public.appointments (service_id);
create index idx_appointments_scheduled on public.appointments (business_id, scheduled_date, scheduled_time);
create index idx_appointments_status on public.appointments (business_id, status);

-- ---------------------------------------------------------------------------
-- ai_settings  (one row per business)
-- ---------------------------------------------------------------------------
create table public.ai_settings (
  id                        uuid primary key default uuid_generate_v4(),
  business_id               uuid not null unique references public.businesses (id) on delete cascade,
  ai_name                   text not null default 'AI Assistant',
  tone                      text not null default 'professional',
  greeting_message          text,
  after_hours_message       text,
  booking_enabled           boolean not null default true,
  transfer_keywords         text[] not null default '{}',
  max_call_duration_seconds integer not null default 300,
  language                  text not null default 'en',
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index idx_ai_settings_business_id on public.ai_settings (business_id);

-- ---------------------------------------------------------------------------
-- faqs
-- ---------------------------------------------------------------------------
create table public.faqs (
  id          uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  question    text not null,
  answer      text not null,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_faqs_business_id on public.faqs (business_id);

-- ---------------------------------------------------------------------------
-- reply_templates
-- ---------------------------------------------------------------------------
create table public.reply_templates (
  id            uuid primary key default uuid_generate_v4(),
  business_id   uuid not null references public.businesses (id) on delete cascade,
  template_key  text not null,
  label         text not null,
  template_text text not null,
  is_active     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_reply_templates_business_id on public.reply_templates (business_id);
create unique index idx_reply_templates_biz_key on public.reply_templates (business_id, template_key);

-- ---------------------------------------------------------------------------
-- booking_rules  (one row per business)
-- ---------------------------------------------------------------------------
create table public.booking_rules (
  id                          uuid primary key default uuid_generate_v4(),
  business_id                 uuid not null unique references public.businesses (id) on delete cascade,
  advance_booking_hours       integer not null default 2,
  max_booking_days_ahead      integer not null default 30,
  buffer_minutes              integer not null default 15,
  allow_same_day              boolean not null default true,
  allow_walk_ins              boolean not null default true,
  custom_rules                text,
  cancellation_notice_hours   integer not null default 24,
  cancellation_fee_percentage numeric not null default 0,
  cancellation_policy_text    text,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index idx_booking_rules_business_id on public.booking_rules (business_id);

-- ---------------------------------------------------------------------------
-- automation_settings  (one row per business)
-- ---------------------------------------------------------------------------
create table public.automation_settings (
  id                            uuid primary key default uuid_generate_v4(),
  business_id                   uuid not null unique references public.businesses (id) on delete cascade,
  sms_reminders_enabled         boolean not null default true,
  sms_reminder_hours_before     integer not null default 24,
  missed_lead_followup_enabled  boolean not null default true,
  missed_lead_delay_minutes     integer not null default 5,
  review_requests_enabled       boolean not null default false,
  review_request_delay_hours    integer not null default 2,
  review_link                   text,
  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now()
);

create index idx_automation_settings_business_id on public.automation_settings (business_id);

-- ---------------------------------------------------------------------------
-- subscriptions
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  id                     uuid primary key default uuid_generate_v4(),
  business_id            uuid not null references public.businesses (id) on delete cascade,
  stripe_subscription_id text not null,
  stripe_customer_id     text not null,
  plan_id                text not null,
  status                 text not null,
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index idx_subscriptions_business_id on public.subscriptions (business_id);
create index idx_subscriptions_stripe_sub_id on public.subscriptions (stripe_subscription_id);
create index idx_subscriptions_stripe_cust_id on public.subscriptions (stripe_customer_id);

-- ---------------------------------------------------------------------------
-- team_members
-- ---------------------------------------------------------------------------
create table public.team_members (
  id            uuid primary key default uuid_generate_v4(),
  business_id   uuid not null references public.businesses (id) on delete cascade,
  user_id       uuid references auth.users (id) on delete set null,
  role          text not null default 'staff',
  invited_email text,
  joined_at     timestamptz,
  created_at    timestamptz not null default now()
);

create index idx_team_members_business_id on public.team_members (business_id);
create index idx_team_members_user_id on public.team_members (user_id);

-- ---------------------------------------------------------------------------
-- call_logs
-- ---------------------------------------------------------------------------
create table public.call_logs (
  id               uuid primary key default uuid_generate_v4(),
  business_id      uuid not null references public.businesses (id) on delete cascade,
  customer_id      uuid references public.customers (id) on delete set null,
  caller_phone     text not null,
  call_type        text not null,
  duration_seconds integer not null default 0,
  transcript       text,
  outcome          text not null,
  ai_handled       boolean not null default false,
  created_at       timestamptz not null default now()
);

create index idx_call_logs_business_id on public.call_logs (business_id);
create index idx_call_logs_customer_id on public.call_logs (customer_id);
create index idx_call_logs_created_at on public.call_logs (business_id, created_at desc);

-- ---------------------------------------------------------------------------
-- sms_logs
-- ---------------------------------------------------------------------------
create table public.sms_logs (
  id            uuid primary key default uuid_generate_v4(),
  business_id   uuid not null references public.businesses (id) on delete cascade,
  customer_id   uuid references public.customers (id) on delete set null,
  phone_number  text not null,
  direction     text not null,
  message_text  text not null,
  template_key  text,
  status        text not null,
  created_at    timestamptz not null default now()
);

create index idx_sms_logs_business_id on public.sms_logs (business_id);
create index idx_sms_logs_customer_id on public.sms_logs (customer_id);
create index idx_sms_logs_created_at on public.sms_logs (business_id, created_at desc);

-- =========================================================================
-- TRIGGERS — auto-update updated_at columns
-- =========================================================================
create trigger trg_businesses_updated_at
  before update on public.businesses
  for each row execute function public.set_updated_at();

create trigger trg_services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create trigger trg_customers_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

create trigger trg_appointments_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

create trigger trg_ai_settings_updated_at
  before update on public.ai_settings
  for each row execute function public.set_updated_at();

create trigger trg_faqs_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

create trigger trg_reply_templates_updated_at
  before update on public.reply_templates
  for each row execute function public.set_updated_at();

create trigger trg_booking_rules_updated_at
  before update on public.booking_rules
  for each row execute function public.set_updated_at();

create trigger trg_automation_settings_updated_at
  before update on public.automation_settings
  for each row execute function public.set_updated_at();

create trigger trg_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- =========================================================================
-- ROW LEVEL SECURITY
-- =========================================================================

-- Enable RLS on every table ------------------------------------------------
alter table public.businesses          enable row level security;
alter table public.business_hours      enable row level security;
alter table public.services            enable row level security;
alter table public.customers           enable row level security;
alter table public.appointments        enable row level security;
alter table public.ai_settings         enable row level security;
alter table public.faqs                enable row level security;
alter table public.reply_templates     enable row level security;
alter table public.booking_rules       enable row level security;
alter table public.automation_settings enable row level security;
alter table public.subscriptions       enable row level security;
alter table public.team_members        enable row level security;
alter table public.call_logs           enable row level security;
alter table public.sms_logs            enable row level security;

-- ---- businesses ----------------------------------------------------------
create policy "Owners can view their own businesses"
  on public.businesses for select
  using (owner_id = auth.uid());

create policy "Owners can insert their own businesses"
  on public.businesses for insert
  with check (owner_id = auth.uid());

create policy "Owners can update their own businesses"
  on public.businesses for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "Owners can delete their own businesses"
  on public.businesses for delete
  using (owner_id = auth.uid());

-- ---- business_hours ------------------------------------------------------
create policy "Owners can view business_hours"
  on public.business_hours for select
  using (business_id in (select public.get_my_business_ids()));

create policy "Owners can insert business_hours"
  on public.business_hours for insert
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can update business_hours"
  on public.business_hours for update
  using (business_id in (select public.get_my_business_ids()))
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can delete business_hours"
  on public.business_hours for delete
  using (business_id in (select public.get_my_business_ids()));

-- ---- services ------------------------------------------------------------
create policy "Owners can view services"
  on public.services for select
  using (business_id in (select public.get_my_business_ids()));

create policy "Owners can insert services"
  on public.services for insert
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can update services"
  on public.services for update
  using (business_id in (select public.get_my_business_ids()))
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can delete services"
  on public.services for delete
  using (business_id in (select public.get_my_business_ids()));

-- ---- customers -----------------------------------------------------------
create policy "Owners can view customers"
  on public.customers for select
  using (business_id in (select public.get_my_business_ids()));

create policy "Owners can insert customers"
  on public.customers for insert
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can update customers"
  on public.customers for update
  using (business_id in (select public.get_my_business_ids()))
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can delete customers"
  on public.customers for delete
  using (business_id in (select public.get_my_business_ids()));

-- ---- appointments --------------------------------------------------------
create policy "Owners can view appointments"
  on public.appointments for select
  using (business_id in (select public.get_my_business_ids()));

create policy "Owners can insert appointments"
  on public.appointments for insert
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can update appointments"
  on public.appointments for update
  using (business_id in (select public.get_my_business_ids()))
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can delete appointments"
  on public.appointments for delete
  using (business_id in (select public.get_my_business_ids()));

-- ---- ai_settings ---------------------------------------------------------
create policy "Owners can view ai_settings"
  on public.ai_settings for select
  using (business_id in (select public.get_my_business_ids()));

create policy "Owners can insert ai_settings"
  on public.ai_settings for insert
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can update ai_settings"
  on public.ai_settings for update
  using (business_id in (select public.get_my_business_ids()))
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can delete ai_settings"
  on public.ai_settings for delete
  using (business_id in (select public.get_my_business_ids()));

-- ---- faqs ----------------------------------------------------------------
create policy "Owners can view faqs"
  on public.faqs for select
  using (business_id in (select public.get_my_business_ids()));

create policy "Owners can insert faqs"
  on public.faqs for insert
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can update faqs"
  on public.faqs for update
  using (business_id in (select public.get_my_business_ids()))
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can delete faqs"
  on public.faqs for delete
  using (business_id in (select public.get_my_business_ids()));

-- ---- reply_templates -----------------------------------------------------
create policy "Owners can view reply_templates"
  on public.reply_templates for select
  using (business_id in (select public.get_my_business_ids()));

create policy "Owners can insert reply_templates"
  on public.reply_templates for insert
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can update reply_templates"
  on public.reply_templates for update
  using (business_id in (select public.get_my_business_ids()))
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can delete reply_templates"
  on public.reply_templates for delete
  using (business_id in (select public.get_my_business_ids()));

-- ---- booking_rules -------------------------------------------------------
create policy "Owners can view booking_rules"
  on public.booking_rules for select
  using (business_id in (select public.get_my_business_ids()));

create policy "Owners can insert booking_rules"
  on public.booking_rules for insert
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can update booking_rules"
  on public.booking_rules for update
  using (business_id in (select public.get_my_business_ids()))
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can delete booking_rules"
  on public.booking_rules for delete
  using (business_id in (select public.get_my_business_ids()));

-- ---- automation_settings -------------------------------------------------
create policy "Owners can view automation_settings"
  on public.automation_settings for select
  using (business_id in (select public.get_my_business_ids()));

create policy "Owners can insert automation_settings"
  on public.automation_settings for insert
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can update automation_settings"
  on public.automation_settings for update
  using (business_id in (select public.get_my_business_ids()))
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can delete automation_settings"
  on public.automation_settings for delete
  using (business_id in (select public.get_my_business_ids()));

-- ---- subscriptions -------------------------------------------------------
create policy "Owners can view subscriptions"
  on public.subscriptions for select
  using (business_id in (select public.get_my_business_ids()));

create policy "Owners can insert subscriptions"
  on public.subscriptions for insert
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can update subscriptions"
  on public.subscriptions for update
  using (business_id in (select public.get_my_business_ids()))
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can delete subscriptions"
  on public.subscriptions for delete
  using (business_id in (select public.get_my_business_ids()));

-- ---- team_members --------------------------------------------------------
create policy "Owners can view team_members"
  on public.team_members for select
  using (business_id in (select public.get_my_business_ids()));

create policy "Owners can insert team_members"
  on public.team_members for insert
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can update team_members"
  on public.team_members for update
  using (business_id in (select public.get_my_business_ids()))
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can delete team_members"
  on public.team_members for delete
  using (business_id in (select public.get_my_business_ids()));

-- ---- call_logs -----------------------------------------------------------
create policy "Owners can view call_logs"
  on public.call_logs for select
  using (business_id in (select public.get_my_business_ids()));

create policy "Owners can insert call_logs"
  on public.call_logs for insert
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can update call_logs"
  on public.call_logs for update
  using (business_id in (select public.get_my_business_ids()))
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can delete call_logs"
  on public.call_logs for delete
  using (business_id in (select public.get_my_business_ids()));

-- ---- sms_logs ------------------------------------------------------------
create policy "Owners can view sms_logs"
  on public.sms_logs for select
  using (business_id in (select public.get_my_business_ids()));

create policy "Owners can insert sms_logs"
  on public.sms_logs for insert
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can update sms_logs"
  on public.sms_logs for update
  using (business_id in (select public.get_my_business_ids()))
  with check (business_id in (select public.get_my_business_ids()));

create policy "Owners can delete sms_logs"
  on public.sms_logs for delete
  using (business_id in (select public.get_my_business_ids()));

-- =========================================================================
-- Done.
-- =========================================================================
