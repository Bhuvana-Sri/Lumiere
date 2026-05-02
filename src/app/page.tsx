import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { ImgWithFallback } from '@/components/ImgWithFallback';
import { treatments } from '@/lib/treatments';

const testimonials = [
  {
    initials: 'PR',
    name: 'Priya R.',
    meta: 'Laser resurfacing',
    quote:
      'The consultation alone was worth it. No upselling, no pressure — just genuine expertise. My laser results have been exceptional.'
  },
  {
    initials: 'SK',
    name: 'Sneha K.',
    meta: 'Botox · 3 visits',
    quote:
      'The most calming clinic I have visited. The booking flow was seamless and the deposit gave me real confidence in my appointment.'
  },
  {
    initials: 'AM',
    name: 'Aanya M.',
    meta: 'Filler · returning',
    quote:
      "Refined results without any of the overdone look. The team's restraint and craft is what brings me back every time."
  }
];

const treatmentImageSrcs = [
  '/images/botulinumToxin.jpg',
  '/images/dermalFiller.jpg',
  '/images/laserResurfacing.jpg',
  '/images/skinTherapies.jpg'
];

export default function HomePage() {
  return (
    <>
      <Nav />

      <main id="main">
        {/* Hero */}
        <section className="grid md:grid-cols-[1.05fr_1fr] gap-10 md:gap-14 items-center px-6 md:px-12 py-12 md:py-20 max-w-[1200px] mx-auto">
          <Reveal>
            <div className="smalcap">Aesthetic medicine · Bengaluru</div>
            <h1 className="serif-h text-[40px] md:text-[58px] lg:text-[64px] mt-4 mb-5">
              The art of <em className="italic text-sage-600">quiet</em>
              <br />
              refinement.
            </h1>
            <p className="text-[14px] md:text-[15px] leading-relaxed text-charcoal-500 max-w-[400px] mb-8">
              A boutique clinic devoted to restoring confidence — helping you
              feel at home in your own skin. Botox, dermal filler, laser, and
              skin therapies, performed with restraint by a single surgeon's
              hand.
            </p>
            <Link href="#treatments" className="link-cta">
              Explore treatments &nbsp;→
            </Link>
          </Reveal>

          <Reveal delay={0.15}>
            <div
              className="relative aspect-[4/5] overflow-hidden"
              style={{
                background:
                  'radial-gradient(ellipse at 60% 45%, #C8CDB9 0%, #DCDFD3 65%)'
              }}
            >
              {/* Drop hero.jpg into /public/images/ to replace the sage placeholder */}
              <ImgWithFallback
                src="/images/hero.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <svg
                viewBox="0 0 80 80"
                aria-hidden="true"
                className="absolute bottom-4 left-4 w-16 h-16 opacity-70"
              >
                <g stroke="#8FA088" strokeWidth="0.8" fill="none">
                  <path d="M 10,70 Q 30,55 50,40 Q 60,32 70,20" />
                </g>
                <g fill="#8FA088">
                  <ellipse cx="20" cy="62" rx="6" ry="2.5" transform="rotate(-25 20 62)" />
                  <ellipse cx="32" cy="54" rx="6" ry="2.5" transform="rotate(-30 32 54)" />
                  <ellipse cx="44" cy="44" rx="6" ry="2.5" transform="rotate(-35 44 44)" />
                  <ellipse cx="56" cy="34" rx="5" ry="2.2" transform="rotate(-40 56 34)" />
                  <ellipse cx="65" cy="24" rx="4" ry="2" transform="rotate(-45 65 24)" />
                </g>
              </svg>
            </div>
          </Reveal>
        </section>

        {/* Before / After */}
        <section className="bg-charcoal-700 text-cream-100 px-6 md:px-12 py-16 md:py-24 text-center">
          <div className="smalcap !text-cream-100/65">Real results</div>
          <h2 className="serif-h text-[28px] md:text-[36px] mt-2 mb-9 text-cream-100">
            Before, <em className="italic text-cream-100/65">after</em>.
          </h2>
          <BeforeAfterSlider
            beforeSrc="/images/before.jpg"
            afterSrc="/images/after.jpg"
          />
        </section>

        {/* Treatments */}
        <section
          id="treatments"
          className="px-6 md:px-12 py-16 md:py-24 max-w-[1200px] mx-auto"
        >
          <div className="flex items-end justify-between gap-4 mb-9">
            <div>
              <div className="smalcap">Our offering</div>
              <h2 className="serif-h text-[28px] md:text-[36px] mt-2">
                Treatments.
              </h2>
            </div>
            <Link href="/book" className="link-cta">
              Book consult &nbsp;→
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {treatments.map((t, i) => (
              <Reveal key={t.slug} delay={i * 0.08}>
                <Link href={`/book?treatment=${t.slug}`} className="group block">
                  <div className="aspect-[1/1.15] overflow-hidden bg-sage-50">
                    <ImgWithFallback
                      src={treatmentImageSrcs[i]}
                      alt={t.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                  <h3 className="font-serif text-[19px] md:text-[20px] font-normal mt-4 mb-1">
                    {t.name}
                  </h3>
                  <p className="text-[12px] md:text-[13px] leading-snug text-charcoal-400 mb-2">
                    {t.blurb}
                  </p>
                  <div className="text-[11px] font-medium tracking-widest text-charcoal-500">
                    From ₹{t.fromPriceInr.toLocaleString('en-IN')}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-6 md:px-12 py-16 md:py-24 max-w-[1200px] mx-auto">
          <div className="mb-9">
            <div className="smalcap">Testimonials</div>
            <h2 className="serif-h text-[28px] md:text-[36px] mt-2">
              What our clients say.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <figure className="bg-white border border-charcoal-700/10 hover:border-charcoal-700/25 transition-colors p-6 md:p-7">
                  <div className="text-sage-600 text-[12px] tracking-[0.3em] mb-4">
                    ★★★★★
                  </div>
                  <blockquote className="text-[13px] md:text-[14px] leading-relaxed text-charcoal-700 mb-5">
                    {t.quote}
                  </blockquote>
                  <figcaption className="flex items-center gap-3 border-t border-charcoal-700/10 pt-4">
                    <div className="w-8 h-8 rounded-full bg-sage-50 text-charcoal-500 text-[11px] font-medium flex items-center justify-center">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium">{t.name}</div>
                      <div className="text-[11px] text-charcoal-400">
                        {t.meta}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-sage-50 px-6 md:px-12 py-20 md:py-28 text-center">
          <div className="smalcap">Begin</div>
          <h2 className="serif-h text-[32px] md:text-[44px] mt-3 mb-4">
            Book your consultation.
          </h2>
          <p className="text-[14px] text-charcoal-500 max-w-[420px] mx-auto mb-8 leading-relaxed">
            Secure your appointment with a small refundable deposit. We'll
            confirm everything within the hour.
          </p>
          <Link href="/book" className="pill-btn">
            Book now · ₹500 deposit
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
