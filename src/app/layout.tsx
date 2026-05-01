import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lumière — Aesthetic medicine, Bengaluru',
  description:
    'A boutique aesthetic clinic in Bengaluru. Botox, fillers, laser, and skin therapies — performed with restraint to restore confidence and help you feel at home in your own skin.',
  openGraph: {
    title: 'Lumière — Aesthetic medicine, Bengaluru',
    description:
      'A boutique clinic restoring confidence through considered, results-led aesthetic treatments.',
    type: 'website',
    locale: 'en_IN'
  },
  icons: {
    icon: [{ url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90' font-family='Georgia,serif'%3EL%3C/text%3E%3C/svg%3E" }]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Manrope:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a
          href="#main"
          className="absolute left-0 top-0 -translate-y-full focus:translate-y-0 bg-charcoal-700 text-cream-100 px-4 py-2 text-xs tracking-widest uppercase z-50 transition-transform"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
