import { WizardShell } from '@/components/onboarding/wizard-shell';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Setup Your Business',
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto mb-8 max-w-4xl text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to AutoBook AI</h1>
        <p className="mt-2 text-gray-600">Let&apos;s set up your AI receptionist in just a few minutes.</p>
      </div>
      <WizardShell />
    </div>
  );
}
