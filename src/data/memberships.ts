/**
 * DEMO PRICING — IRON//VOID is a fictional gym. Replace every number here.
 * `yearly` is the price per month when billed annually (no discount claim is made in the UI;
 * the two figures are simply shown side by side).
 */
export const membershipMeta = {
  currency: '$',
  demoNotice: 'Demo values — IRON//VOID is a concept. Prices, plans and inclusions are placeholders in src/data/memberships.ts.',
  billing: [
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' },
  ] as const,
};

export type Billing = (typeof membershipMeta.billing)[number]['id'];

export type Plan = {
  id: string;
  name: string;
  summary: string;
  price: Record<Billing, number>;
  featured?: boolean;
};

export const plans: Plan[] = [
  { id: 'floor', name: 'FLOOR', summary: 'Open-gym access to the training floor.', price: { monthly: 89, yearly: 79 } },
  { id: 'forge', name: 'FORGE', summary: 'Floor access plus coached group sessions.', price: { monthly: 149, yearly: 129 }, featured: true },
  { id: 'void', name: 'VOID', summary: 'Everything, plus individual programming.', price: { monthly: 249, yearly: 219 } },
];

/** Comparison rows: value per plan id. true/false render as included / not included. */
export const comparison: { label: string; values: Record<string, string | boolean> }[] = [
  { label: 'Training floor access', values: { floor: 'Staffed hours', forge: 'Staffed hours', void: 'Extended hours' } },
  { label: 'Coached group sessions', values: { floor: false, forge: '12 / month', void: 'Unlimited' } },
  { label: 'Onboarding session', values: { floor: true, forge: true, void: true } },
  { label: 'Individual programming', values: { floor: false, forge: false, void: true } },
  { label: 'Recovery room', values: { floor: false, forge: true, void: true } },
  { label: 'Guest passes', values: { floor: false, forge: '1 / month', void: '4 / month' } },
];
