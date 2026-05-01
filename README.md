# Lumière

A boutique aesthetic clinic website with a working booking + payment flow. Built as a single-surgeon practice site for Bengaluru.

**Live demo**: deploy to Vercel (instructions below) — usually `https://lumiere-clinic.vercel.app`

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS**
- **Framer Motion** for scroll-reveal, page transitions, and the draggable before/after slider
- **Stripe Checkout** for refundable booking deposits (cards, UPI, netbanking on Indian accounts)
- **Supabase** (Postgres) for booking storage, secured via service-role key on the server only
- **Resend** for transactional booking-confirmation emails
- **Cookie-based admin auth** for the surgeon's dashboard at `/admin`

All backends run on free tiers.

## Architecture

```
   Client                    Server                 Third parties
   ──────                    ──────                 ─────────────
   /book ─────fetch────► /api/checkout ─────► Stripe Checkout
                                                     │
   /book/success ◄──── redirect after payment ◄──────┘
                                                     │
                          /api/webhook ◄──── webhook (signed)
                              │
                              ├─► Supabase (insert booking)
                              └─► Resend (email confirmation)

   /admin (cookie-auth) ─── Server Component ─► Supabase (list bookings)
   /admin status update ──► /api/bookings ─────► Supabase (update)
```

The booking is created **only** by the Stripe webhook after successful payment — never by the client form. This means: no payment, no DB row, no spam, and Stripe's retry logic handles transient failures.

## Quickstart (local development)

You need **Node.js 18+** and a Stripe / Supabase / Resend account (all free).

```bash
git clone https://github.com/YOUR-USERNAME/lumiere-clinic.git
cd lumiere-clinic
npm install
cp .env.example .env.local
# edit .env.local with your keys (see "Environment setup" below)
npm run dev
```

Site is at <http://localhost:3000>. The booking flow won't complete payment without Stripe configured, but every other page works.

### To test the full booking flow locally

In a second terminal:

```bash
# 1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/webhook
# Copy the printed `whsec_…` and paste into STRIPE_WEBHOOK_SECRET in .env.local
```

Then book through `/book` and pay with Stripe's test card `4242 4242 4242 4242` (any future expiry, any CVC). The webhook fires, the booking lands in Supabase, the email goes out (or warns if Resend isn't set), and `/admin` shows the booking.

## Environment setup

Each service is free and takes 2-5 minutes to set up. Recommended order:

### 1. Supabase
- Create a project at <https://supabase.com>
- SQL Editor → paste `supabase/schema.sql` → Run
- Project Settings → API → copy `URL` and `service_role` key into `.env.local`

### 2. Stripe
- Sign up at <https://dashboard.stripe.com/register>
- Stay in **test mode** for now — top right of dashboard
- Developers → API keys → copy `Secret key` (`sk_test_…`) and `Publishable key` into `.env.local`
- For local dev: install Stripe CLI, run `stripe listen --forward-to localhost:3000/api/webhook` to get a webhook secret
- For production: Developers → Webhooks → Add endpoint → URL `https://your-domain.com/api/webhook`, event `checkout.session.completed` → copy the signing secret into Vercel env vars

### 3. Resend (optional but recommended)
- Sign up at <https://resend.com> (3 000 free emails/month)
- Add and verify your domain (or skip for now and use the default `onboarding@resend.dev` for testing)
- API Keys → create → copy into `.env.local`

### 4. Admin password
- Pick a strong password (`ADMIN_PASSWORD`)
- Generate a session-signing secret: `openssl rand -hex 32` → paste into `ADMIN_AUTH_SECRET`

## Deploy to Vercel

1. Push to GitHub:
   ```bash
   gh repo create lumiere-clinic --public --source=. --push
   # or manually: git remote add origin … && git push -u origin main
   ```
2. <https://vercel.com/new> → import the repo
3. Vercel auto-detects Next.js. Before deploying, click **Environment Variables** and paste every value from your `.env.local` (except `NEXT_PUBLIC_SITE_URL` — set this to your final domain, e.g. `https://lumiere-clinic.vercel.app`)
4. Deploy. Done in ~60 seconds.
5. In the Stripe dashboard, register the production webhook URL (`https://your-domain.com/api/webhook`) and copy the new signing secret back into Vercel's env vars under `STRIPE_WEBHOOK_SECRET`.

## Project structure

```
src/
├── app/
│   ├── page.tsx                    Homepage (hero, slider, treatments, testimonials)
│   ├── about/page.tsx              "The clinic" — bio + qualifications
│   ├── book/
│   │   ├── page.tsx                Booking flow entry
│   │   └── success/page.tsx        Post-Stripe confirmation
│   ├── admin/
│   │   ├── page.tsx                Bookings dashboard (cookie-protected)
│   │   └── login/page.tsx          Password gate
│   ├── api/
│   │   ├── checkout/route.ts       Creates Stripe Checkout session
│   │   ├── webhook/route.ts        Stripe webhook → Supabase + Resend
│   │   └── bookings/route.ts       Admin status updates
│   ├── globals.css                 Tailwind + design tokens
│   └── layout.tsx                  Root layout, fonts, metadata
├── components/
│   ├── Nav.tsx
│   ├── Footer.tsx
│   ├── Reveal.tsx                  Framer Motion scroll-reveal wrapper
│   ├── BeforeAfterSlider.tsx       Drag/touch/keyboard slider
│   ├── BookingForm.tsx             Multi-step form with calendar
│   └── AdminBookings.tsx           Admin table with filtering
├── lib/
│   ├── treatments.ts               Single source of truth for treatments
│   ├── stripe.ts
│   ├── supabase.ts
│   ├── email.ts                    Resend wrapper + branded HTML email
│   └── admin-auth.ts               Cookie + HMAC for admin auth
└── public/
    └── images/                     hero.jpg, before.jpg, after.jpg, doctor.jpg
                                    (placeholders render until you add real photos)
```

## Adding real photos

Drop these into `public/images/`. The site renders sage-toned CSS placeholders until you do.

- `hero.jpg` — homepage hero, portrait orientation, ~1200×1500
- `before.jpg` and `after.jpg` — clinical results, same crop and lighting, ~1200×900 each
- `doctor.jpg` — about-page portrait, ~1000×1250

Compress with <https://squoosh.app/> before committing — aim for ≤200 KB each. Get written patient consent before publishing any before/after photographs.

## Customisation

- **Treatments and prices**: edit `src/lib/treatments.ts` — every page reads from this file.
- **Surgeon's name and qualifications**: search `src/app/about/page.tsx` for `[Friend's Name]` and `[Institution]`.
- **Address, phone, email**: search the codebase for `[Clinic address]`, `[phone]`, and `hello@lumiere.clinic`.
- **Colour palette**: in `tailwind.config.ts` under `theme.extend.colors`.
- **Deposit amount**: per-treatment in `src/lib/treatments.ts` (`depositInr` field).
- **Available time slots**: `timeSlots` array in `src/components/BookingForm.tsx`.

## What's intentionally simple (and how to upgrade)

| Limitation | Upgrade path |
|---|---|
| No real-time availability check (two clients can book the same slot — surgeon manages in admin) | Add a server-side check in `/api/checkout` that queries Supabase for conflicts |
| Single-password admin auth | Swap `lib/admin-auth.ts` for **NextAuth** or **Supabase Auth** if you need multiple staff |
| Email is a single confirmation | Add reminder emails 24h before via a cron (Vercel Cron + a `/api/reminders` route) |
| No SMS reminders | Wire up Twilio / Msg91 in the webhook handler |
| Calendar shows whole month | Add a `disabled_dates` table in Supabase for holidays/vacations |

## Accessibility

- Skip-to-content link
- Semantic landmarks (`header`, `main`, `nav`, `footer`, `section`)
- Slider supports drag, touch, *and* arrow keys
- All images have `alt` text
- `prefers-reduced-motion` respected throughout
- Focus states preserved on all interactive elements

## License

MIT — see `LICENSE`.
