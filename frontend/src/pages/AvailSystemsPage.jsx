import React, { useMemo, useState } from 'react';

const systems = [
  {
    id: 'smart-monitoring',
    name: 'Smart Monitoring System',
    summary: 'Track operations, activity spikes, alerts, and performance trends in one command center.',
    badge: 'Featured',
    accent: 'from-blue-600 to-indigo-700',
    highlights: [
      'Real-time dashboards',
      'Alert routing and thresholds',
      'Usage trend forecasting',
      'Tenant-level visibility',
    ],
    plans: [
      {
        name: 'Starter',
        price: '₱1,499',
        detail: 'For early-stage teams that need essential monitoring.',
        features: ['1 dashboard', 'Email alerts', 'Weekly reports'],
      },
      {
        name: 'Growth',
        price: '₱2,499',
        detail: 'For growing teams that need faster response and deeper insights.',
        features: ['5 dashboards', 'Smart alerts', 'Daily reports', 'Priority support'],
      },
      {
        name: 'Enterprise',
        price: 'Customs',
        detail: 'For advanced deployments with custom workflows and governance.',
        features: ['Unlimited dashboards', 'API access', 'SLA support', 'Custom onboarding'],
      },
    ],
  },
  {
    id: 'workflow-automation',
    name: 'Workflow Automation Suite',
    summary: 'Automate repetitive admin tasks, approvals, and customer follow-ups.',
    badge: 'Coming soon',
    accent: 'from-emerald-500 to-teal-700',
    highlights: ['Rule-based automations', 'Approval chains', 'Notification templates'],
    plans: [
      { name: 'Launch', price: '₱19', detail: 'Entry automation for small teams.', features: ['3 automations', 'Basic templates'] },
      { name: 'Scale', price: '₱59', detail: 'More workflows, more control.', features: ['20 automations', 'Webhook support', 'Team permissions'] },
    ],
  },
  {
    id: 'analytics-suite',
    name: 'Business Analytics Suite',
    summary: 'Turn raw usage data into decision-ready reports and executive summaries.',
    badge: 'New',
    accent: 'from-rose-500 to-orange-600',
    highlights: ['Executive reporting', 'Custom metrics', 'CSV exports'],
    plans: [
      { name: 'Lite', price: '₱24', detail: 'Simple reporting for teams starting out.', features: ['Monthly reports', '3 metrics'] },
      { name: 'Pro', price: '₱69', detail: 'For teams that need deeper insight and more exports.', features: ['Daily reports', 'Custom metrics', 'Unlimited exports'] },
    ],
  },
];

const AvailSystemsPage = ({ theme = 'light' }) => {
  const [selectedSystemId, setSelectedSystemId] = useState(systems[0].id);
  const selectedSystem = useMemo(
    () => systems.find((system) => system.id === selectedSystemId) || systems[0],
    [selectedSystemId]
  );
  const [selectedPlanName, setSelectedPlanName] = useState(selectedSystem.plans[0].name);

  const handleSystemChange = (systemId) => {
    const nextSystem = systems.find((system) => system.id === systemId) || systems[0];
    setSelectedSystemId(nextSystem.id);
    setSelectedPlanName(nextSystem.plans[0].name);
  };

  const activePlan = selectedSystem.plans.find((plan) => plan.name === selectedPlanName) || selectedSystem.plans[0];

  return (
    <div className="space-y-8 pb-12 text-slate-900 dark:text-slate-100 bg-gradient-to-b from-white via-blue-50 to-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-blue-950 dark:to-black">
      <section className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-r from-white via-blue-50 to-blue-100 px-6 py-10 text-slate-900 shadow-2xl sm:px-10 dark:border-slate-800 dark:bg-gradient-to-r dark:from-slate-950 dark:via-blue-950 dark:to-black dark:text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.25),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(244,63,94,0.2),_transparent_30%)]" />
        <div className="relative max-w-3xl">
          <p className="inline-flex rounded-full border border-blue-200 bg-white/70 px-4 py-1 text-sm font-semibold tracking-[0.2em] text-blue-700 uppercase dark:border-white/15 dark:bg-white/10 dark:text-blue-100">
            Avail Systems
          </p>
          <h1 className="mt-5 text-4xl font-black sm:text-5xl">Projects offered by Pinkora Nexus</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-700 dark:text-slate-200">
            Explore the available systems, starting with the Smart Monitoring System. Select a subscription plan to see the next step for your team.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900">Available projects</h2>
          <p className="mt-1 text-sm text-slate-600">Pick a system to review its plan options.</p>

          <div className="mt-5 space-y-3">
            {systems.map((system) => {
              const isSelected = system.id === selectedSystemId;

              return (
                <button
                  key={system.id}
                  type="button"
                  onClick={() => handleSystemChange(system.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{system.badge}</p>
                      <h3 className="mt-2 text-lg font-bold text-slate-900">{system.name}</h3>
                      <p className="mt-2 text-sm text-slate-600">{system.summary}</p>
                    </div>
                    <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${system.accent}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className={`rounded-[1.5rem] bg-gradient-to-br ${selectedSystem.accent} p-6 text-white shadow-xl`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">Featured system</p>
                <h2 className="mt-2 text-3xl font-black">{selectedSystem.name}</h2>
              </div>
              <span className="rounded-full bg-white/15 px-4 py-1 text-sm font-semibold">{selectedSystem.badge}</span>
            </div>
            <p className="mt-4 max-w-2xl text-white/90">{selectedSystem.summary}</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {selectedSystem.highlights.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Subscription plans</h3>
                <p className="text-sm text-slate-600">Select a plan for {selectedSystem.name}.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                Selected: {activePlan.name}
              </span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {selectedSystem.plans.map((plan) => {
                const isSelected = plan.name === selectedPlanName;

                return (
                  <button
                    key={plan.name}
                    type="button"
                    onClick={() => setSelectedPlanName(plan.name)}
                    className={`rounded-3xl border p-5 text-left transition ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{plan.name}</h4>
                        <p className="mt-2 text-sm text-slate-600">{plan.detail}</p>
                      </div>
                      <span className="text-2xl font-black text-slate-900">{plan.price}</span>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-slate-700">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <span className="text-blue-600">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Your selection</p>
                  <h4 className="mt-2 text-xl font-bold text-slate-900">
                    {selectedSystem.name} - {activePlan.name}
                  </h4>
                  <p className="mt-1 text-sm text-slate-600">{activePlan.detail}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:translate-y-[-1px]"
                >
                  Continue with {activePlan.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AvailSystemsPage;