import Link from 'next/link';

const features = [
  {
    title: 'AI Receptionist',
    description: 'Never miss a call again. Your AI receptionist answers 24/7, books appointments, and handles FAQs naturally.',
    icon: '📞',
  },
  {
    title: 'Smart Scheduling',
    description: 'Automated appointment booking that respects your hours, services, and booking rules.',
    icon: '📅',
  },
  {
    title: 'SMS Automation',
    description: 'Automatic reminders, follow-ups with missed leads, and review requests after appointments.',
    icon: '💬',
  },
  {
    title: 'Customer CRM',
    description: 'Track every customer interaction, appointment history, and revenue in one place.',
    icon: '👥',
  },
  {
    title: 'Analytics Dashboard',
    description: 'See call volumes, booking rates, revenue trends, and AI performance metrics at a glance.',
    icon: '📊',
  },
  {
    title: 'Easy Setup',
    description: 'Get started in minutes with our guided wizard. No technical knowledge required.',
    icon: '⚡',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    description: 'Perfect for solo practitioners',
    features: [
      'AI receptionist',
      '100 calls/month',
      'SMS appointment reminders',
      'Online booking page',
      '1 location',
      'Email support',
    ],
    cta: 'Start Free Trial',
    featured: false,
  },
  {
    name: 'Professional',
    price: '$99',
    period: '/month',
    description: 'For growing businesses',
    features: [
      'AI receptionist',
      'Unlimited calls',
      'SMS reminders + follow-ups',
      'Missed lead auto-follow-up',
      'Review request automation',
      'Customer CRM',
      'Analytics dashboard',
      '3 locations',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    description: 'For multi-location businesses',
    features: [
      'Everything in Professional',
      'Unlimited locations',
      'API access',
      'Custom integrations',
      'White-label option',
      'Dedicated account manager',
      'Custom AI training',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Your AI Receptionist,<br />Always On Duty
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 sm:text-xl">
            AutoBook AI answers calls, books appointments, and follows up with customers — so you can focus on what you do best.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="rounded-xl bg-white px-8 py-3 text-lg font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50">
              Start Free Trial
            </Link>
            <Link href="/pricing" className="rounded-xl border-2 border-white/30 px-8 py-3 text-lg font-semibold text-white transition hover:bg-white/10">
              View Pricing
            </Link>
          </div>
          <p className="mt-4 text-sm text-blue-200">14-day free trial. No credit card required.</p>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Everything you need to automate your front desk</h2>
            <p className="mt-4 text-lg text-gray-600">Built for salons, med spas, dental offices, and service businesses.</p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="card text-center">
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-gray-100 px-4 py-20" id="pricing">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-gray-600">Start free. Upgrade when you&apos;re ready.</p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
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
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start text-sm text-gray-600">
                      <svg className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`btn w-full text-center ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Ready to stop missing calls?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Join hundreds of local businesses using AutoBook AI to automate their front desk operations.
          </p>
          <Link href="/signup" className="btn btn-primary mt-8 inline-block px-10 py-3 text-lg">
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </>
  );
}
