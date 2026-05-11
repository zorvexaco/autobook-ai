export interface Business {
  id: string;
  owner_id: string;
  name: string;
  business_type: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  timezone: string;
  logo_url: string | null;
  stripe_customer_id: string | null;
  subscription_plan: string;
  subscription_status: string;
  trial_ends_at: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessHour {
  id: string;
  business_id: string;
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_open: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  duration_minutes: number;
  is_bookable: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  business_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  source: string;
  first_contact_date: string;
  total_appointments: number;
  total_revenue_cents: number;
  last_visit_date: string | null;
  notes: string | null;
  tags: string[];
  sms_consent: boolean;
  review_requested: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  business_id: string;
  customer_id: string;
  service_id: string;
  provider_id: string | null;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: string;
  source: string;
  reminder_sent: boolean;
  confirmation_status: string;
  notes: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiSettings {
  id: string;
  business_id: string;
  ai_name: string;
  tone: string;
  greeting_message: string | null;
  after_hours_message: string | null;
  booking_enabled: boolean;
  transfer_keywords: string[];
  max_call_duration_seconds: number;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface Faq {
  id: string;
  business_id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReplyTemplate {
  id: string;
  business_id: string;
  template_key: string;
  label: string;
  template_text: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BookingRules {
  id: string;
  business_id: string;
  advance_booking_hours: number;
  max_booking_days_ahead: number;
  buffer_minutes: number;
  allow_same_day: boolean;
  allow_walk_ins: boolean;
  custom_rules: string | null;
  cancellation_notice_hours: number;
  cancellation_fee_percentage: number;
  cancellation_policy_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface AutomationSettings {
  id: string;
  business_id: string;
  sms_reminders_enabled: boolean;
  sms_reminder_hours_before: number;
  missed_lead_followup_enabled: boolean;
  missed_lead_delay_minutes: number;
  review_requests_enabled: boolean;
  review_request_delay_hours: number;
  review_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  business_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  plan_id: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}
