'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Props = {
  beforeSrc?: string;
  afterSrc?: string;
  beforeAlt?: string;
  afterAlt?: string;
  caption?: string;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Before treatment',
  afterAlt = 'After treatment',
  caption = 'Drag to compare · Skin renewal protocol'
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); // raw drag offset, 0 = center
  const [containerWidth, setContainerWidth] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Convert drag x into clip percentage (0-100)
  const clipPct = useTransform(x, (val) => {
    if (containerWidth === 0) return 50;
    const half = containerWidth / 2;
    const pct = ((val + half) / containerWidth) * 100;
    return Math.max(4, Math.min(96, pct));
  });

  const afterWidth = useTransform(clipPct, (p) => `${p}%`);
  const handleLeft = useTransform(clipPct, (p) => `${p}%`);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-demo: gently sweep the handle on first mount until the user interacts
  useEffect(() => {
    if (hasInteracted || containerWidth === 0) return;
    const half = containerWidth / 2;
    const ctl = animate(x, [-half * 0.3, half * 0.3, -half * 0.3, 0], {
      duration: 4.5,
      ease: 'easeInOut',
      times: [0, 0.33, 0.66, 1]
    });
    return () => ctl.stop();
  }, [hasInteracted, containerWidth, x]);

  // Keyboard support
  function onKey(e: React.KeyboardEvent) {
    setHasInteracted(true);
    const step = containerWidth * 0.04;
    if (e.key === 'ArrowLeft') {
      x.set(Math.max(-containerWidth / 2, x.get() - step));
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      x.set(Math.min(containerWidth / 2, x.get() + step));
      e.preventDefault();
    }
  }

  return (
    <div className="w-full max-w-[720px] mx-auto">
      <div
        ref={containerRef}
        role="img"
        tabIndex={0}
        onKeyDown={onKey}
        aria-label="Before and after comparison — drag the handle or use arrow keys to compare"
        className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal-500 cursor-ew-resize select-none focus:outline-none focus:ring-2 focus:ring-sage-400/50"
      >
        {/* Before layer (full width) — warm-tone fallback shows if image is missing */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, #9C7E64 0%, #A88A6E 70%)'
          }}
        >
          {beforeSrc && (
            <img
              src={beforeSrc}
              alt={beforeAlt}
              className="w-full h-full object-cover"
              onError={(e) => ((e.currentTarget.style.display = 'none'))}
            />
          )}
        </div>

        {/* After layer — clipped from the left, lighter tone fallback */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{
            width: afterWidth,
            background:
              'radial-gradient(ellipse at 100% 50%, #DCCAB4 0%, #E5D6C3 70%)'
          }}
        >
          {afterSrc && (
            <img
              src={afterSrc}
              alt={afterAlt}
              style={{ width: containerWidth ? `${containerWidth}px` : '200%' }}
              className="h-full object-cover max-w-none"
              onError={(e) => ((e.currentTarget.style.display = 'none'))}
            />
          )}
        </motion.div>

        {/* Tags */}
        <div className="absolute top-4 left-4 bg-black/45 text-cream-100 text-[10px] md:text-[11px] font-medium tracking-widest uppercase px-2.5 py-1.5">
          Before
        </div>
        <div className="absolute top-4 right-4 bg-black/45 text-cream-100 text-[10px] md:text-[11px] font-medium tracking-widest uppercase px-2.5 py-1.5">
          After · 2 sessions
        </div>

        {/* Draggable handle */}
        <motion.div
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          style={{ x, left: handleLeft }}
          onDragStart={() => setHasInteracted(true)}
          whileTap={{ scale: 0.95 }}
          className="absolute top-0 bottom-0 -translate-x-1/2 w-[2px] bg-cream-100 cursor-ew-resize"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-cream-100 border border-charcoal-700 shadow-md flex items-center justify-center">
            <span className="text-charcoal-700 text-sm">↔</span>
          </div>
        </motion.div>
      </div>

      <p className="mt-6 font-serif italic text-[13px] md:text-sm text-cream-100/65 text-center">
        {caption}
      </p>
    </div>
  );
}
