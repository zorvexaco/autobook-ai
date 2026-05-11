export const BUSINESS_TYPES = [
  { value: "salon", label: "Salon" },
  { value: "med_spa", label: "Med Spa" },
  { value: "barber", label: "Barber" },
  { value: "dentist", label: "Dentist" },
  { value: "gym", label: "Gym" },
  { value: "spa", label: "Spa" },
  { value: "cleaning", label: "Cleaning Company" },
  { value: "hvac", label: "HVAC Company" },
  { value: "plumber", label: "Plumber" },
  { value: "landscaper", label: "Landscaper" },
  { value: "real_estate", label: "Real Estate Agent" },
  { value: "photographer", label: "Photographer" },
  { value: "consultant", label: "Consultant" },
  { value: "restaurant", label: "Restaurant" },
  { value: "agency", label: "Agency" },
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number]["value"];

export const BUSINESS_TYPE_DEFAULTS: Record<
  BusinessType,
  { buffer_minutes: number; advance_hours: number; max_days_ahead: number }
> = {
  salon: { buffer_minutes: 15, advance_hours: 2, max_days_ahead: 60 },
  med_spa: { buffer_minutes: 30, advance_hours: 4, max_days_ahead: 90 },
  barber: { buffer_minutes: 10, advance_hours: 1, max_days_ahead: 30 },
  dentist: { buffer_minutes: 15, advance_hours: 24, max_days_ahead: 180 },
  gym: { buffer_minutes: 5, advance_hours: 1, max_days_ahead: 30 },
  spa: { buffer_minutes: 30, advance_hours: 4, max_days_ahead: 90 },
  cleaning: { buffer_minutes: 30, advance_hours: 24, max_days_ahead: 60 },
  hvac: { buffer_minutes: 30, advance_hours: 24, max_days_ahead: 30 },
  plumber: { buffer_minutes: 30, advance_hours: 24, max_days_ahead: 14 },
  landscaper: { buffer_minutes: 30, advance_hours: 24, max_days_ahead: 30 },
  real_estate: { buffer_minutes: 15, advance_hours: 2, max_days_ahead: 60 },
  photographer: { buffer_minutes: 30, advance_hours: 24, max_days_ahead: 90 },
  consultant: { buffer_minutes: 15, advance_hours: 4, max_days_ahead: 60 },
  restaurant: { buffer_minutes: 0, advance_hours: 1, max_days_ahead: 30 },
  agency: { buffer_minutes: 15, advance_hours: 4, max_days_ahead: 60 },
};
