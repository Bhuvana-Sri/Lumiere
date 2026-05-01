export type Treatment = {
  slug: string;
  name: string;
  blurb: string;
  detail: string;
  fromPriceInr: number;
  durationMinutes: number;
  depositInr: number;
};

export const treatments: Treatment[] = [
  {
    slug: 'botox',
    name: 'Botulinum toxin',
    blurb: "Soft, undetectable smoothing for forehead, brows, and crow's feet.",
    detail:
      "Precise, conservative dosing focused on preserving natural movement. Results emerge over 7-14 days and last 3-4 months.",
    fromPriceInr: 12000,
    durationMinutes: 30,
    depositInr: 500
  },
  {
    slug: 'filler',
    name: 'Dermal filler',
    blurb: 'Restoring volume with a light hand and considered placement.',
    detail:
      'Hyaluronic-acid based fillers used to restore lost volume in cheeks, lips, and tear troughs. Reversible, with results lasting 9-18 months.',
    fromPriceInr: 22000,
    durationMinutes: 45,
    depositInr: 500
  },
  {
    slug: 'laser',
    name: 'Laser resurfacing',
    blurb: 'Pigmentation, scars, and tone correction with medical-grade lasers.',
    detail:
      'Fractional and Q-switched laser protocols tailored to skin type and concern. Typically requires 3-6 sessions spaced 4-6 weeks apart.',
    fromPriceInr: 15000,
    durationMinutes: 60,
    depositInr: 500
  },
  {
    slug: 'skin',
    name: 'Skin therapies',
    blurb: 'Peels, microneedling, and bespoke facials for clinical results.',
    detail:
      'Chemical peels, microneedling with PRP, and medical facials chosen by skin assessment, not by package.',
    fromPriceInr: 6500,
    durationMinutes: 60,
    depositInr: 500
  }
];

export function getTreatment(slug: string): Treatment | undefined {
  return treatments.find((t) => t.slug === slug);
}
