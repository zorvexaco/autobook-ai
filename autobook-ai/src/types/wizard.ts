export interface WizardHours {
  [day: string]: { open: string; close: string; isOpen: boolean };
}

export interface WizardService {
  name: string;
  price: string;
  duration: string;
}

export interface WizardFaq {
  question: string;
  answer: string;
}

export interface WizardFormData {
  businessName: string;
  ownerName: string;
  businessType: string;
  phone: string;
  email: string;
  website: string;
  city: string;
  state: string;
  hours: WizardHours;
  services: WizardService[];
  bookingRules: string;
  cancellationPolicy: string;
  faqs: WizardFaq[];
  aiName: string;
  aiTone: string;
  smsReminders: boolean;
  missedLeadFollowup: boolean;
  reviewRequests: boolean;
}

export interface WizardState {
  currentStep: number;
  formData: WizardFormData;
  saving: boolean;
  error: string | null;
}

export type WizardAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'UPDATE_FORM'; payload: Partial<WizardFormData> }
  | { type: 'SET_SAVING'; saving: boolean }
  | { type: 'SET_ERROR'; error: string | null };
