import React, { useRef, useEffect } from 'react';

/**
 * Synwave animated particle field (the signature hero background).
 * Drop it inside any position:relative container with a fixed/min height.
 * Ported 1:1 from the design prototype's canvas logic.
 */
export default function SynwaveBackground() {
  const canvasRef = useRef(null);
  const hostRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, raf = 0, mx = -9999, my = -9999;

    const resize = () => {
      W = host.clientWidth; H = host.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    };
    window.addEventListener('mousemove', onMouse);

    const makeGlow = (r, g, b) => {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const x = c.getContext('2d');
      const grad = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
      grad.addColorStop(0.35, `rgba(${r},${g},${b},0.25)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      x.fillStyle = grad;
      x.fillRect(0, 0, 64, 64);
      return c;
    };

    const goldGlow = makeGlow(240, 197, 129);
    const blueGlow = makeGlow(138, 166, 220);

    const N = 56;
    const ps = [];
    for (let i = 0; i < N; i++) {
      ps.push({
        x: Math.random() * 1600, y: Math.random() * 700,
        r: 1 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.08 - Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        tw: 0.6 + Math.random() * 1.4,
        gold: Math.random() < 0.34,
      });
    }

    const frame = (t) => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = ps[i], b = ps[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 13225) {
            const al = (1 - Math.sqrt(d2) / 115) * 0.16;
            ctx.strokeStyle = `rgba(138,166,220,${al.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (let i = 0; i < N; i++) {
        const p = ps[i];
        p.x += p.vx + Math.sin(t * 0.0004 + p.phase) * 0.12;
        p.y += p.vy;
        if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        const dx = p.x - mx, dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 19600 && d2 > 1) {
          const d = Math.sqrt(d2);
          const f = (1 - d / 140) * 0.6;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }
        const tw = 0.55 + 0.45 * Math.sin(t * 0.001 * p.tw + p.phase);
        const sprite = p.gold ? goldGlow : blueGlow;
        const s = p.r * 16;
        ctx.globalAlpha = tw * 0.9;
        ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
        ctx.globalAlpha = tw;
        ctx.fillStyle = p.gold ? 'rgba(250,228,190,0.95)' : 'rgba(208,220,246,0.95)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <div ref={hostRef} style={{ position: 'absolute', inset: 0 }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
