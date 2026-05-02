export function Footer() {
  return (
    <footer
      id="contact"
      className="bg-charcoal-700 text-cream-100/65 px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-6 md:gap-8 text-[13px] leading-relaxed"
    >
      <div>
        <div className="text-cream-100 font-serif text-[15px] tracking-editorial mb-3">
          LUMIÈRE
        </div>
        <div>Aesthetic medicine, considered.</div>
      </div>
      <div>
        <h4 className="text-cream-100 text-[11px] font-medium tracking-widest uppercase mb-2">
          Visit
        </h4>
        <div>
          Green glen layout, Bellandur
          <br />
          Bengaluru
        </div>
      </div>
      <div>
        <h4 className="text-cream-100 text-[11px] font-medium tracking-widest uppercase mb-2">
          Hours
        </h4>
        <div>
          Tue–Sat
          <br />
          10:00 — 19:00
        </div>
      </div>
      <div>
        <h4 className="text-cream-100 text-[11px] font-medium tracking-widest uppercase mb-2">
          Contact
        </h4>
        <div>
          +91 99595 29691
          <br />
          hello@lumiere.clinic
        </div>
      </div>
    </footer>
  );
}
