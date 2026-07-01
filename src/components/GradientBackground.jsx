import { useEffect, useRef } from 'react';

export default function GradientBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const particles = [];
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 6 + 2;
      p.style.cssText = `
        width:${size}px;height:${size}px;
        left:${Math.random()*100}%;
        animation-duration:${Math.random()*15+10}s;
        animation-delay:${Math.random()*10}s;
        opacity:${Math.random()*0.4+0.1};
      `;
      container.appendChild(p);
      particles.push(p);
    }
    return () => particles.forEach(p => p.remove());
  }, []);

  return (
    <div ref={containerRef} style={{
      position:'fixed', inset:0,
      background:'radial-gradient(ellipse at 30% 20%, #2a1b5e 0%, #1a1245 40%, #0d0a2e 100%)',
      zIndex: -1, overflow:'hidden', pointerEvents:'none'
    }} />
  );
}
