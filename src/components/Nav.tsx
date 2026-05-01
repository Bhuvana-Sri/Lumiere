'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/#treatments', label: 'Treatments' },
  { href: '/about', label: 'The clinic' },
  { href: '/#contact', label: 'Contact' }
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="flex items-center justify-between gap-4 px-6 md:px-12 py-5 md:py-6 border-b border-charcoal-700/10 flex-wrap">
      <Link
        href="/"
        className="font-serif text-[17px] md:text-[18px] font-medium tracking-editorial whitespace-nowrap"
      >
        LUMIÈRE
      </Link>

      <nav
        aria-label="Primary"
        className="flex items-center gap-5 md:gap-8 order-3 md:order-2 w-full md:w-auto justify-center md:justify-start pt-3 md:pt-0 border-t md:border-t-0 border-charcoal-700/10"
      >
        {links.map((link) => {
          const isActive =
            link.href === '/about'
              ? pathname === '/about'
              : pathname === '/' && link.href.startsWith('/#');
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[11px] font-medium tracking-widest uppercase whitespace-nowrap transition-colors hover:text-sage-600 ${
                isActive ? 'text-sage-600' : 'text-charcoal-500'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Link href="/book" className="pill-btn order-2 md:order-3">
        Book a consultation
      </Link>
    </header>
  );
}
