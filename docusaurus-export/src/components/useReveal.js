import { useEffect } from 'react';

/**
 * Scroll-reveal for any element tagged with `data-reveal` (value = delay in ms).
 * Uses IntersectionObserver — cleaner than scroll listeners and SSR-safe.
 * Call once near the top of a page component.
 */
export default function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]'));
    els.forEach((el) => {
      const delay = parseInt(el.getAttribute('data-reveal'), 10) || 0;
      el.style.transition =
        'opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1)';
      el.style.transitionDelay = delay + 'ms';
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'none';
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
