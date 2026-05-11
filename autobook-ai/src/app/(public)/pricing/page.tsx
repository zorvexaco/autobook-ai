import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for AutoBook AI. Start with a 14-day free trial.',
};

const plans = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    yearlyPrice: '$470',
    yearlyPeriod: '/year',
    description: 'Perfect for solo practitioners getting started with AI',
    features: [
      { text: 'AI receptionist', included: true },
      { text: '100 calls/month', included: true },
      { text: 'SMS appointment reminders', included: true },
      { text: 'Online booking page', included: true },
      { text: '1 location', included: true },
      { text: 'Email support', included: true },
      { text: 'Missed lead follow-up', included: false },
      { text: 'Review request automation', included: false },
      { text: 'Customer CRM', included: false },
      { text: 'Analytics dashboard', included: false },
    ],
    featured: false,
  },
  {
    name: 'Professional',
    price: '$99',
    period: '/month',
    yearlyPrice: '$950',
    yearlyPeriod: '/year',
    description: 'For growing businesses that want full automation',
    features: [
      { text: 'AI receptionist', included: true },
      { text: 'Unlimited calls', included: true },
      { text: 'SMS reminders + follow-ups', included: true },
      { text: 'Online booking page', included: true },
      { text: '3 locations', included: true },
      { text: 'Priority support', included: true },
      { text: 'Missed lead auto-follow-up', included: true },
      { text: 'Review request automation', included: true },
      { text: 'Customer CRM', included: true },
      { text: 'Analytics dashboard', included: true },
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    yearlyPrice: '$1,910',
    yearlyPeriod: '/year',
    description: 'For multi-location businesses with advanced needs',
    features: [
      { text: 'Everything in Professional', included: true },
      { text: 'Unlimited locations', included: true },
      { text: 'API access', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'White-label option', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom AI training', included: true },
      { text: 'SLA guarantee', included: true },
      { text: 'Phone support', included: true },
      { text: 'Custom onboarding', included: true },
    ],
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Plans & Pricing</h1>
          <p className="mt-4 text-lg text-gray-600">
            Start with a 14-day free trial. No credit card required.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card relative flex flex-col ${
                plan.featured ? 'border-2 border-brand ring-4 ring-blue-100' : ''
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-sm font-medium text-white">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <p className="mt-1 text-sm text-gray-400">
                  or {plan.yearlyPrice}{plan.yearlyPeriod} (save ~20%)
                </p>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start text-sm">
                    {f.included ? (
                      <svg className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={f.included ? 'text-gray-700' : 'text-gray-400'}>{f.text}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`btn w-full text-center ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}
              >
                Start Free Trial
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900">All plans include</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {['14-day free trial', 'No setup fees', 'Cancel anytime', 'Free onboarding'].map((item) => (
              <div key={item} className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
