import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { ImgWithFallback } from '@/components/ImgWithFallback';

export default function AboutPage() {
  return (
    <>
      <Nav />

      <main id="main">
        {/* Bio hero */}
        <section className="grid md:grid-cols-[1fr_1.1fr] gap-8 md:gap-16 items-center px-6 md:px-12 py-12 md:py-20 max-w-[1200px] mx-auto">
          <Reveal>
            <div
              className="relative aspect-[4/5] overflow-hidden"
              style={{
                background:
                  'radial-gradient(ellipse at 55% 40%, #C8CDB9 0%, #DCDFD3 70%)'
              }}
            >
              <ImgWithFallback
                src="/images/doctor.jpg"
                alt="Portrait of the founding surgeon"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="smalcap">The clinic</div>
            <h1 className="serif-h text-[36px] md:text-[52px] lg:text-[56px] mt-4 mb-7">
              A surgeon's hand,
              <br />
              <em className="italic text-sage-600">an artist's restraint.</em>
            </h1>
            <p className="text-[15px] leading-relaxed text-charcoal-500 max-w-[440px]">
              Lumière is the practice of{' '}
              <strong className="font-medium text-charcoal-700">
                Dr. [Friend's Name]
              </strong>{' '}
              — a maxillofacial surgeon turned aesthetic physician, working solo
              by intent.
            </p>
          </Reveal>
        </section>

        {/* Bio body */}
        <section className="grid md:grid-cols-[1.6fr_1fr] gap-12 md:gap-20 px-6 md:px-12 pb-20 md:pb-24 max-w-[1200px] mx-auto items-start">
          <Reveal className="max-w-[580px]">
            <p className="font-serif italic text-[22px] md:text-[24px] leading-snug text-charcoal-700 mb-8">
              Her practice is built on a single belief: the face is not a canvas
              to be reworked, but a structure to be respected.
            </p>
            <div className="text-[15px] leading-[1.85] text-charcoal-700 space-y-5">
              <p>
                Dr. [Friend's Name] began her career in oral and maxillofacial
                surgery — the surgical specialty that addresses the precise
                anatomy and reconstructive needs of the face and jaw. The
                training is long, technical, and unforgiving. It demands a
                steady hand, an exhaustive understanding of facial structure,
                and the patience to work in millimetres.
              </p>
              <p>
                Earlier in her career she practised dentistry and trained in
                hair transplantation — two disciplines that share the same
                demands as surgery: precision, an unhurried hand, and respect
                for natural form. Each contributed something to her present
                practice — the clinical patience of dentistry, the line-by-line
                attention of trichology, the structural foresight of
                maxillofacial work.
              </p>
              <p>
                Her path to aesthetic medicine was not a pivot but a deepening.
                After completing advanced certification in aesthetic and
                cosmetic medicine, she found that the same anatomical training
                that informed surgical reconstruction also illuminated the
                subtler work of injectables, lasers, and skin therapy. The hand
                was already there. What changed was the medium.
              </p>
              <p>
                Today she practises with one principle above all others:{' '}
                <em className="italic text-sage-600">restraint</em>. Her work is
                defined as much by what she chooses not to do as by what she
                does. The result is the kind of subtle improvement that no one
                else can name — only that you look like the calmest,
                best-rested version of yourself.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <aside
              aria-labelledby="cred-title"
              className="border-t border-charcoal-700/15 pt-7 md:sticky md:top-8"
            >
              <h2 id="cred-title" className="smalcap mb-6">
                Qualifications
              </h2>
              <ul className="space-y-0">
                {[
                  ['BDS', 'Bachelor of Dental Surgery', '[Institution]'],
                  ['MDS', 'Oral & Maxillofacial Surgery', '[Institution]'],
                  ['FHT', 'Hair Transplantation Fellowship', '[Institution]'],
                  ['DAAM', 'Advanced Aesthetic Medicine', '[Institution]']
                ].map(([deg, title, inst], i, arr) => (
                  <li
                    key={deg}
                    className={`grid grid-cols-[56px_1fr] gap-4 py-4 ${
                      i < arr.length - 1 ? 'border-b border-charcoal-700/10' : ''
                    }`}
                  >
                    <div className="font-serif text-[18px] font-medium text-sage-600 tracking-wide">
                      {deg}
                    </div>
                    <div className="text-[13px] leading-snug font-medium text-charcoal-700">
                      {title}
                      <br />
                      <span className="font-light text-[12px] text-charcoal-400">
                        {inst}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </Reveal>
        </section>

        {/* Philosophy */}
        <section className="bg-cream-200 px-6 md:px-12 py-20 md:py-24 text-center">
          <div className="smalcap">Philosophy</div>
          <blockquote className="font-serif italic text-[22px] md:text-[28px] lg:text-[30px] leading-snug max-w-[640px] mx-auto my-5 text-charcoal-700">
            "My promise to every client is the same — you should look like the
            best, calmest version of yourself. Not someone else."
          </blockquote>
          <cite className="not-italic smalcap">— Dr. [Friend's Name]</cite>
        </section>

        {/* CTA */}
        <section className="bg-sage-50 px-6 md:px-12 py-20 md:py-28 text-center">
          <div className="smalcap">Begin</div>
          <h2 className="serif-h text-[32px] md:text-[44px] mt-3 mb-4">
            Book a consultation.
          </h2>
          <p className="text-[14px] text-charcoal-500 max-w-[420px] mx-auto mb-8 leading-relaxed">
            Every treatment begins with an unhurried, no-pressure conversation.
            Bring questions, photographs, or simply curiosity.
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
