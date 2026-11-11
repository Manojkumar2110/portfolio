'use client';

import { useEffect, useRef, ElementType, forwardRef } from 'react';
import gsap from 'gsap';

// Lightweight text split — no premium GSAP plugin needed.

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: ElementType;
}

export default function AnimatedText({
  text,
  className = '',
  delay = 0,
  stagger = 0.04,
  as: Tag = 'span',
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll('.word');
    gsap.fromTo(
      words,
      { y: '110%', opacity: 0, rotateX: -40 },
      {
        y: '0%',
        opacity: 1,
        rotateX: 0,
        duration: 0.9,
        stagger,
        delay,
        ease: 'power4.out',
      }
    );
  }, [delay, stagger]);

  const wordSpans = text.split(' ').map((word, i) => (
    <span
      key={i}
      style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
    >
      <span className="word" style={{ display: 'inline-block' }}>
        {word}
        {i < text.split(' ').length - 1 ? '\u00A0' : ''}
      </span>
    </span>
  ));

  return (
    <div ref={ref} className={className} style={{ display: 'contents' }}>
      {wordSpans}
    </div>
  );
}
