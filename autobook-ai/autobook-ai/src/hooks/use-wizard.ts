'use client';

import { useReducer, useCallback } from 'react';

interface WizardHours {
  [day: string]: { open: string; close: string; isOpen: boolean };
}

interface WizardService {
  name: string;
  price: string;
  duration: string;
}

interface WizardFaq {
  question: string;
  answer: string;
}

interface WizardFormData {
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

interface WizardState {
  currentStep: number;
  formData: WizardFormData;
  saving: boolean;
  error: string | null;
}

type WizardAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'UPDATE_FORM'; payload: Partial<WizardFormData> }
  | { type: 'SET_SAVING'; saving: boolean }
  | { type: 'SET_ERROR'; error: string | null };

const TOTAL_STEPS = 8;

const defaultHours: WizardHours = {
  Monday: { open: '09:00', close: '17:00', isOpen: true },
  Tuesday: { open: '09:00', close: '17:00', isOpen: true },
  Wednesday: { open: '09:00', close: '17:00', isOpen: true },
  Thursday: { open: '09:00', close: '17:00', isOpen: true },
  Friday: { open: '09:00', close: '17:00', isOpen: true },
  Saturday: { open: '10:00', close: '15:00', isOpen: false },
  Sunday: { open: '10:00', close: '15:00', isOpen: false },
};

const initialFormData: WizardFormData = {
  businessName: '',
  ownerName: '',
  businessType: '',
  phone: '',
  email: '',
  website: '',
  city: '',
  state: '',
  hours: defaultHours,
  services: [{ name: '', price: '', duration: '30' }],
  bookingRules: '',
  cancellationPolicy: '',
  faqs: [{ question: '', answer: '' }],
  aiName: 'Alex',
  aiTone: 'friendly',
  smsReminders: true,
  missedLeadFollowup: true,
  reviewRequests: true,
};

const initialState: WizardState = {
  currentStep: 0,
  formData: initialFormData,
  saving: false,
  error: null,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS - 1), error: null };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0), error: null };
    case 'GO_TO_STEP':
      return { ...state, currentStep: action.step, error: null };
    case 'UPDATE_FORM':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_SAVING':
      return { ...state, saving: action.saving };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    default:
      return state;
  }
}

export function useWizard() {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const nextStep = useCallback(() => dispatch({ type: 'NEXT_STEP' }), []);
  const prevStep = useCallback(() => dispatch({ type: 'PREV_STEP' }), []);
  const goToStep = useCallback((step: number) => dispatch({ type: 'GO_TO_STEP', step }), []);
  const updateForm = useCallback((payload: Partial<WizardFormData>) => dispatch({ type: 'UPDATE_FORM', payload }), []);
  const setSaving = useCallback((saving: boolean) => dispatch({ type: 'SET_SAVING', saving }), []);
  const setError = useCallback((error: string | null) => dispatch({ type: 'SET_ERROR', error }), []);

  return {
    ...state,
    totalSteps: TOTAL_STEPS,
    nextStep,
    prevStep,
    goToStep,
    updateForm,
    setSaving,
    setError,
  };
}
