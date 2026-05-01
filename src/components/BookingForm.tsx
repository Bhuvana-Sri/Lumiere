'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { treatments, getTreatment, type Treatment } from '@/lib/treatments';

type Step = 1 | 2 | 3 | 4;

type BookingState = {
  treatment: Treatment | null;
  date: string | null; // YYYY-MM-DD
  time: string | null; // HH:mm (24h)
  name: string;
  email: string;
  phone: string;
  notes: string;
};

const stepVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export function BookingForm() {
  const params = useSearchParams();
  const router = useRouter();
  const presetTreatment = params.get('treatment');
  const cancelled = params.get('cancelled') === '1';

  const initialTreatment = presetTreatment ? getTreatment(presetTreatment) ?? null : null;

  const [step, setStep] = useState<Step>(initialTreatment ? 2 : 1);
  const [state, setState] = useState<BookingState>({
    treatment: initialTreatment,
    date: null,
    time: null,
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateState(patch: Partial<BookingState>) {
    setState((s) => ({ ...s, ...patch }));
  }

  async function submit() {
    if (!state.treatment || !state.date || !state.time) return;
    setSubmitting(true);
    setError(null);

    // Combine date + time into Asia/Kolkata ISO
    const [hh, mm] = state.time.split(':').map(Number);
    const local = new Date(`${state.date}T${pad(hh)}:${pad(mm)}:00`);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatmentSlug: state.treatment.slug,
          appointmentAt: local.toISOString(),
          clientName: state.name.trim(),
          clientEmail: state.email.trim(),
          clientPhone: state.phone.trim(),
          notes: state.notes.trim() || undefined
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Checkout failed');
      window.location.href = json.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-[640px] mx-auto px-6 md:px-0 py-12 md:py-20">
      {/* Step indicator */}
      <ol className="flex items-center gap-2 md:gap-4 mb-12 text-[10px] md:text-[11px] tracking-widest uppercase font-medium">
        {[
          { n: 1, label: 'Treatment' },
          { n: 2, label: 'When' },
          { n: 3, label: 'You' },
          { n: 4, label: 'Pay' }
        ].map((s, i, arr) => (
          <li key={s.n} className="flex items-center gap-2 md:gap-4">
            <span
              className={`flex items-center gap-2 ${
                step === s.n
                  ? 'text-charcoal-700'
                  : step > s.n
                    ? 'text-sage-600'
                    : 'text-charcoal-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                  step === s.n
                    ? 'bg-charcoal-700 text-cream-100 border-charcoal-700'
                    : step > s.n
                      ? 'bg-sage-600 text-cream-100 border-sage-600'
                      : 'bg-transparent border-charcoal-700/30'
                }`}
              >
                {step > s.n ? '✓' : s.n}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </span>
            {i < arr.length - 1 && (
              <span className="w-4 md:w-8 h-px bg-charcoal-700/15" aria-hidden />
            )}
          </li>
        ))}
      </ol>

      {cancelled && (
        <div className="mb-8 border border-charcoal-700/20 bg-cream-200 px-4 py-3 text-[13px] text-charcoal-500">
          Payment cancelled. Your booking is not yet confirmed — feel free to start again.
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <StepHeading eyebrow="01 — Treatment" title="What brings you in?" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
              {treatments.map((t) => (
                <button
                  key={t.slug}
                  onClick={() => {
                    updateState({ treatment: t });
                    setStep(2);
                  }}
                  className="text-left border border-charcoal-700/15 hover:border-charcoal-700 transition-colors p-5"
                >
                  <div className="font-serif text-[20px] mb-1">{t.name}</div>
                  <div className="text-[12px] text-charcoal-400 mb-3 leading-snug">
                    {t.blurb}
                  </div>
                  <div className="text-[11px] tracking-widest font-medium text-charcoal-500">
                    From ₹{t.fromPriceInr.toLocaleString('en-IN')} ·{' '}
                    {t.durationMinutes} min
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && state.treatment && (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <StepHeading eyebrow="02 — When" title="Choose a date and time." />
            <DateTimePicker
              date={state.date}
              time={state.time}
              onDate={(d) => updateState({ date: d, time: null })}
              onTime={(t) => updateState({ time: t })}
            />
            <StepNav
              onBack={initialTreatment ? null : () => setStep(1)}
              onNext={() => setStep(3)}
              nextDisabled={!state.date || !state.time}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <StepHeading eyebrow="03 — You" title="Your details." />
            <div className="space-y-6 mt-8">
              <FormField label="Full name">
                <input
                  className="input"
                  value={state.name}
                  onChange={(e) => updateState({ name: e.target.value })}
                  autoComplete="name"
                  required
                />
              </FormField>
              <FormField label="Email">
                <input
                  type="email"
                  className="input"
                  value={state.email}
                  onChange={(e) => updateState({ email: e.target.value })}
                  autoComplete="email"
                  required
                />
              </FormField>
              <FormField label="Phone">
                <input
                  type="tel"
                  className="input"
                  value={state.phone}
                  onChange={(e) => updateState({ phone: e.target.value })}
                  autoComplete="tel"
                  placeholder="+91 ..."
                  required
                />
              </FormField>
              <FormField label="Anything we should know? (optional)">
                <textarea
                  className="input min-h-[80px] py-3"
                  value={state.notes}
                  onChange={(e) => updateState({ notes: e.target.value })}
                  rows={3}
                />
              </FormField>
            </div>
            <StepNav
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
              nextDisabled={
                !isValidName(state.name) ||
                !isValidEmail(state.email) ||
                !isValidPhone(state.phone)
              }
            />
          </motion.div>
        )}

        {step === 4 && state.treatment && state.date && state.time && (
          <motion.div
            key="step4"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <StepHeading eyebrow="04 — Confirm" title="Review and pay deposit." />
            <dl className="mt-8 border-t border-charcoal-700/15">
              {[
                ['Treatment', state.treatment.name],
                ['Date', formatDate(state.date)],
                ['Time', formatTime(state.time)],
                ['Name', state.name],
                ['Email', state.email],
                ['Phone', state.phone],
                ['Deposit', `₹${state.treatment.depositInr.toLocaleString('en-IN')} (refundable)`]
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[120px_1fr] gap-3 py-4 border-b border-charcoal-700/10 text-[14px]"
                >
                  <dt className="smalcap !text-[10px] pt-1">{k}</dt>
                  <dd className="text-charcoal-700">{v}</dd>
                </div>
              ))}
            </dl>

            {error && (
              <div className="mt-6 text-[13px] text-red-700 border border-red-300 bg-red-50 px-4 py-3">
                {error}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                onClick={() => setStep(3)}
                className="text-[11px] tracking-widest uppercase font-medium text-charcoal-500 hover:text-charcoal-700 transition-colors"
                disabled={submitting}
              >
                ← Back
              </button>
              <button
                onClick={submit}
                disabled={submitting}
                className="pill-btn"
              >
                {submitting
                  ? 'Redirecting…'
                  : `Pay ₹${state.treatment.depositInr.toLocaleString('en-IN')} deposit`}
              </button>
            </div>
            <p className="mt-4 text-[12px] text-charcoal-400 text-right">
              Secure payment by Stripe. Cards, UPI, and netbanking accepted.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------- date/time picker -------------------- */

function DateTimePicker({
  date,
  time,
  onDate,
  onTime
}: {
  date: string | null;
  time: string | null;
  onDate: (d: string) => void;
  onTime: (t: string) => void;
}) {
  const [monthOffset, setMonthOffset] = useState(0);
  const cal = useMemo(() => buildMonth(monthOffset), [monthOffset]);

  return (
    <div className="mt-8 grid md:grid-cols-[1fr_220px] gap-8 md:gap-10">
      {/* Calendar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
            disabled={monthOffset === 0}
            className="text-charcoal-500 disabled:text-charcoal-700/20 hover:text-charcoal-700 px-2"
            aria-label="Previous month"
          >
            ←
          </button>
          <div className="font-serif text-[20px]">{cal.monthLabel}</div>
          <button
            onClick={() => setMonthOffset((m) => Math.min(2, m + 1))}
            disabled={monthOffset === 2}
            className="text-charcoal-500 disabled:text-charcoal-700/20 hover:text-charcoal-700 px-2"
            aria-label="Next month"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] tracking-widest uppercase text-charcoal-400 mb-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cal.days.map((d, i) =>
            d.empty ? (
              <div key={i} />
            ) : (
              <button
                key={i}
                disabled={d.disabled}
                onClick={() => onDate(d.iso)}
                className={`aspect-square text-[13px] transition-colors ${
                  d.iso === date
                    ? 'bg-charcoal-700 text-cream-100'
                    : d.disabled
                      ? 'text-charcoal-700/20 cursor-not-allowed'
                      : 'text-charcoal-700 hover:bg-cream-200'
                }`}
                aria-label={d.iso}
              >
                {d.day}
              </button>
            )
          )}
        </div>
        <p className="text-[11px] text-charcoal-400 mt-3">
          The clinic is open Tuesday to Saturday.
        </p>
      </div>

      {/* Time slots */}
      <div>
        <div className="smalcap mb-3">
          {date ? formatDate(date) : 'Pick a date first'}
        </div>
        {date && (
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((t) => (
              <button
                key={t}
                onClick={() => onTime(t)}
                className={`py-2 text-[13px] border transition-colors ${
                  t === time
                    ? 'border-charcoal-700 bg-charcoal-700 text-cream-100'
                    : 'border-charcoal-700/15 hover:border-charcoal-700'
                }`}
              >
                {formatTime(t)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------- helpers -------------------- */

function StepHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <div className="smalcap">{eyebrow}</div>
      <h1 className="serif-h text-[28px] md:text-[40px] mt-2">{title}</h1>
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  nextDisabled
}: {
  onBack: (() => void) | null;
  onNext: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-10 flex items-center justify-between gap-4">
      {onBack ? (
        <button
          onClick={onBack}
          className="text-[11px] tracking-widest uppercase font-medium text-charcoal-500 hover:text-charcoal-700 transition-colors"
        >
          ← Back
        </button>
      ) : (
        <span />
      )}
      <button onClick={onNext} disabled={nextDisabled} className="pill-btn">
        Continue →
      </button>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="smalcap mb-1 inline-block">{label}</span>
      {children}
    </label>
  );
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function buildMonth(offset: number) {
  const today = new Date();
  const view = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const monthLabel = view.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric'
  });

  // Use Mon-first week (ISO weeks)
  const firstDay = new Date(view);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Mon=0..Sun=6
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();

  const days: { day?: number; iso: string; empty?: boolean; disabled?: boolean }[] = [];

  for (let i = 0; i < startWeekday; i++) days.push({ iso: '', empty: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(view.getFullYear(), view.getMonth(), d);
    const iso = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(d)}`;
    const dow = date.getDay(); // 0=Sun, 1=Mon ... 6=Sat
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isClosed = dow === 0 || dow === 1; // Sun, Mon closed
    days.push({
      day: d,
      iso,
      disabled: isPast || isClosed
    });
  }

  return { monthLabel, days };
}

const timeSlots = [
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30'
];

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}

function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${period}`;
}

function isValidName(s: string) {
  return s.trim().length >= 2;
}
function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}
function isValidPhone(s: string) {
  return /^[+\d\s().-]{7,20}$/.test(s.trim());
}
