'use client';

import { useWizard } from '@/hooks/use-wizard';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { StepBusinessInfo } from './steps/step-business-info';
import { StepContact } from './steps/step-contact';
import { StepHours } from './steps/step-hours';
import { StepServices } from './steps/step-services';
import { StepBookingRules } from './steps/step-booking-rules';
import { StepFaqs } from './steps/step-faqs';
import { StepAiSettings } from './steps/step-ai-settings';
import { StepAutomation } from './steps/step-automation';

const STEP_TITLES = [
  'Business Info',
  'Contact Details',
  'Business Hours',
  'Services',
  'Booking Rules',
  'FAQs',
  'AI Settings',
  'Automation',
];

export function WizardShell() {
  const wizard = useWizard();
  const router = useRouter();

  const supabase = createClient();

  const handleComplete = async () => {
    wizard.setSaving(true);
    wizard.setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fd = wizard.formData;

      // 1. Create business
      const { data: biz, error: bizErr } = await supabase
        .from('businesses')
        .insert({
          owner_id: user.id,
          name: fd.businessName,
          business_type: fd.businessType,
          phone: fd.phone || null,
          email: fd.email || null,
          website: fd.website || null,
          city: fd.city || null,
          state: fd.state || null,
          onboarding_completed: true,
        })
        .select()
        .single();

      if (bizErr) throw bizErr;
      const businessId = biz.id;

      // 2. Insert business hours
      const dayMap: Record<string, number> = {
        Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
        Thursday: 4, Friday: 5, Saturday: 6,
      };
      const hoursRows = Object.entries(fd.hours).map(([day, h]) => ({
        business_id: businessId,
        day_of_week: dayMap[day],
        open_time: h.isOpen ? h.open : null,
        close_time: h.isOpen ? h.close : null,
        is_open: h.isOpen,
      }));
      await supabase.from('business_hours').insert(hoursRows);

      // 3. Insert services
      const validServices = fd.services.filter((s) => s.name.trim());
      if (validServices.length > 0) {
        const serviceRows = validServices.map((s, i) => ({
          business_id: businessId,
          name: s.name,
          price_cents: Math.round(parseFloat(s.price || '0') * 100),
          duration_minutes: parseInt(s.duration || '30', 10),
          sort_order: i,
        }));
        await supabase.from('services').insert(serviceRows);
      }

      // 4. Insert booking rules
      await supabase.from('booking_rules').insert({
        business_id: businessId,
        custom_rules: fd.bookingRules || null,
        cancellation_policy_text: fd.cancellationPolicy || null,
      });

      // 5. Insert FAQs
      const validFaqs = fd.faqs.filter((f) => f.question.trim() && f.answer.trim());
      if (validFaqs.length > 0) {
        const faqRows = validFaqs.map((f, i) => ({
          business_id: businessId,
          question: f.question,
          answer: f.answer,
          sort_order: i,
        }));
        await supabase.from('faqs').insert(faqRows);
      }

      // 6. Insert AI settings
      await supabase.from('ai_settings').insert({
        business_id: businessId,
        ai_name: fd.aiName || 'Alex',
        tone: fd.aiTone || 'friendly',
      });

      // 7. Insert automation settings
      await supabase.from('automation_settings').insert({
        business_id: businessId,
        sms_reminders_enabled: fd.smsReminders,
        missed_lead_followup_enabled: fd.missedLeadFollowup,
        review_requests_enabled: fd.reviewRequests,
      });

      router.push('/dashboard');
    } catch (err: any) {
      wizard.setError(err.message || 'Failed to save. Please try again.');
    } finally {
      wizard.setSaving(false);
    }
  };

  const steps = [
    <StepBusinessInfo key="biz" formData={wizard.formData} updateForm={wizard.updateForm} />,
    <StepContact key="contact" formData={wizard.formData} updateForm={wizard.updateForm} />,
    <StepHours key="hours" formData={wizard.formData} updateForm={wizard.updateForm} />,
    <StepServices key="services" formData={wizard.formData} updateForm={wizard.updateForm} />,
    <StepBookingRules key="rules" formData={wizard.formData} updateForm={wizard.updateForm} />,
    <StepFaqs key="faqs" formData={wizard.formData} updateForm={wizard.updateForm} />,
    <StepAiSettings key="ai" formData={wizard.formData} updateForm={wizard.updateForm} />,
    <StepAutomation key="auto" formData={wizard.formData} updateForm={wizard.updateForm} />,
  ];

  const isLastStep = wizard.currentStep === wizard.totalSteps - 1;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Step {wizard.currentStep + 1} of {wizard.totalSteps}</span>
          <span>{STEP_TITLES[wizard.currentStep]}</span>
        </div>
        <div className="h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-brand transition-all duration-300"
            style={{ width: `${((wizard.currentStep + 1) / wizard.totalSteps) * 100}%` }}
          />
        </div>
        <div className="mt-3 flex gap-1 overflow-x-auto">
          {STEP_TITLES.map((title, i) => (
            <button
              key={title}
              onClick={() => wizard.goToStep(i)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition ${
                i === wizard.currentStep
                  ? 'bg-brand text-white'
                  : i < wizard.currentStep
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {wizard.error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{wizard.error}</div>
      )}

      {/* Step Content */}
      <div className="card">{steps[wizard.currentStep]}</div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={wizard.prevStep}
          disabled={wizard.currentStep === 0}
          className="btn btn-secondary disabled:opacity-50"
        >
          Back
        </button>
        {isLastStep ? (
          <button
            onClick={handleComplete}
            disabled={wizard.saving}
            className="btn btn-accent"
          >
            {wizard.saving ? 'Saving...' : 'Complete Setup'}
          </button>
        ) : (
          <button onClick={wizard.nextStep} className="btn btn-primary">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
