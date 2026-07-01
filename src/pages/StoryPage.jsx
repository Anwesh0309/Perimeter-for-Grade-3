import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';

// ── Story illustrations as detailed inline SVGs ────────────────────
function IllustrationFarm() {
  return (
    <svg viewBox="0 0 480 220" style={{ width: '100%', maxWidth: 460, borderRadius: '0.75rem' }}>
      {/* Sky */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f"/>
          <stop offset="100%" stopColor="#2d6a4f"/>
        </linearGradient>
        <pattern id="grassP" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#2d6a4f"/>
          <line x1="10" y1="0" x2="10" y2="20" stroke="#27ae60" strokeWidth="0.5"/>
        </pattern>
        <pattern id="gridCell" width="26" height="22" patternUnits="userSpaceOnUse">
          <rect width="26" height="22" fill="rgba(34,197,94,0.18)"/>
          <rect width="26" height="22" fill="none" stroke="rgba(34,197,94,0.4)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="480" height="220" fill="url(#sky)"/>
      {/* Ground */}
      <rect y="150" width="480" height="70" fill="url(#grassP)"/>
      {/* Grid patch */}
      <rect x="80" y="55" width="208" height="110" fill="url(#gridCell)" stroke="#22c55e" strokeWidth="2.5" rx="3"/>
      {/* Fence posts */}
      {[80,106,132,158,184,210,236,262,288].map(x=>(
        <rect key={x} x={x-2} y="48" width="4" height="20" fill="#92400e" rx="1"/>
      ))}
      {[55,77,99,121,143,165].map(y=>(
        <rect key={y} x="73" y={y} width="20" height="4" fill="#92400e" rx="1"/>
      ))}
      {/* Dim labels */}
      <text x="184" y="42" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="15" fill="#f5b81a">8 m</text>
      <text x="60" y="112" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="14" fill="#f5b81a" transform="rotate(-90,60,112)">5 m</text>
      <text x="184" y="182" textAnchor="middle" fontFamily="Baloo 2" fontWeight="700" fontSize="13" fill="rgba(255,255,255,0.5)">8 m</text>
      <text x="302" y="112" textAnchor="middle" fontFamily="Baloo 2" fontWeight="700" fontSize="13" fill="rgba(255,255,255,0.5)" transform="rotate(90,302,112)">5 m</text>
      {/* Farmer */}
      <text x="370" y="165" fontSize="52">👨‍🌾</text>
      {/* Mouse */}
      <text x="82" y="175" fontSize="34">🐭</text>
      {/* Rabbit */}
      <text x="330" y="185" fontSize="28">🐰</text>
      {/* Carrots in patch */}
      {[110,140,170,200,230,260].map(x=>(
        <text key={x} x={x} y="110" fontSize="18">🥕</text>
      ))}
      {/* Speech from farmer */}
      <rect x="310" y="95" width="155" height="38" rx="8" fill="white"/>
      <text x="388" y="116" textAnchor="middle" fontFamily="Nunito" fontWeight="800" fontSize="12" fill="#1a1245">How much fencing?</text>
    </svg>
  );
}

function IllustrationBoundary() {
  return (
    <svg viewBox="0 0 480 220" style={{ width: '100%', maxWidth: 460, borderRadius: '0.75rem' }}>
      <defs>
        <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1245"/>
          <stop offset="100%" stopColor="#2d4a3e"/>
        </linearGradient>
      </defs>
      <rect width="480" height="220" fill="url(#sky2)"/>
      {/* Patch */}
      <rect x="80" y="45" width="210" height="120" fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="2" rx="3"/>
      {/* Animated dotted perimeter walk */}
      <rect x="80" y="45" width="210" height="120" fill="none" stroke="#f5b81a" strokeWidth="3.5" strokeDasharray="10,6" rx="3"/>
      {/* Running totals callouts */}
      <rect x="125" y="22" width="120" height="22" rx="6" fill="rgba(245,184,26,0.2)" stroke="rgba(245,184,26,0.5)"/>
      <text x="185" y="37" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#f5b81a">Top: 8 m → total 8</text>
      <rect x="298" y="80" width="130" height="22" rx="6" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.5)"/>
      <text x="363" y="95" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#22c55e">+5 = 13</text>
      <rect x="100" y="177" width="140" height="22" rx="6" fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.5)"/>
      <text x="170" y="192" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#93c5fd">+8 = 21</text>
      <rect x="20" y="80" width="120" height="22" rx="6" fill="rgba(236,72,153,0.2)" stroke="rgba(236,72,153,0.5)"/>
      <text x="80" y="95" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#f9a8d4">+5 = 26! 🎉</text>
      {/* Big total badge */}
      <rect x="155" y="85" width="140" height="46" rx="10" fill="rgba(245,184,26,0.2)" stroke="rgba(245,184,26,0.6)" strokeWidth="2"/>
      <text x="225" y="105" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="14" fill="white">Perimeter</text>
      <text x="225" y="124" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="16" fill="#f5b81a">= 26 m ✓</text>
      {/* Mouse walking */}
      <text x="84" y="185" fontSize="30">🐭</text>
      <text x="280" y="185" fontSize="22">👟</text>
    </svg>
  );
}

function IllustrationSquare() {
  return (
    <svg viewBox="0 0 480 220" style={{ width: '100%', maxWidth: 460, borderRadius: '0.75rem' }}>
      <defs>
        <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b"/>
          <stop offset="100%" stopColor="#2d3a5e"/>
        </linearGradient>
        <pattern id="flowers" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="rgba(236,72,153,0.08)"/>
          <text x="8" y="22" fontSize="18">🌸</text>
        </pattern>
      </defs>
      <rect width="480" height="220" fill="url(#sky3)"/>
      {/* Square garden */}
      <rect x="110" y="35" width="180" height="150" fill="url(#flowers)" stroke="#ec4899" strokeWidth="2.5" rx="4"/>
      <rect x="110" y="35" width="180" height="150" fill="none" stroke="#f5b81a" strokeWidth="2" strokeDasharray="8,5" rx="4"/>
      {/* Side labels */}
      <text x="200" y="28" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="15" fill="#f5b81a">6 m</text>
      <text x="98" y="115" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="15" fill="#f5b81a" transform="rotate(-90,98,115)">6 m</text>
      <text x="200" y="205" textAnchor="middle" fontFamily="Baloo 2" fontWeight="700" fontSize="13" fill="rgba(255,255,255,0.4)">6 m</text>
      <text x="302" y="115" textAnchor="middle" fontFamily="Baloo 2" fontWeight="700" fontSize="13" fill="rgba(255,255,255,0.4)" transform="rotate(90,302,115)">6 m</text>
      {/* Shortcut badge */}
      <rect x="315" y="60" width="155" height="58" rx="10" fill="rgba(245,184,26,0.15)" stroke="rgba(245,184,26,0.5)" strokeWidth="1.5"/>
      <text x="392" y="82" textAnchor="middle" fontFamily="Baloo 2" fontWeight="800" fontSize="13" fill="white">Shortcut! ✨</text>
      <text x="392" y="100" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="14" fill="#f5b81a">4 × 6 = 24 m</text>
      {/* Neighbour Oliver */}
      <text x="360" y="175" fontSize="42">👴</text>
      {/* Mouse */}
      <text x="120" y="205" fontSize="28">🐭</text>
    </svg>
  );
}

function IllustrationLShape() {
  return (
    <svg viewBox="0 0 480 220" style={{ width: '100%', maxWidth: 460, borderRadius: '0.75rem' }}>
      <defs>
        <linearGradient id="sky4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1445"/>
          <stop offset="100%" stopColor="#1a3a5c"/>
        </linearGradient>
      </defs>
      <rect width="480" height="220" fill="url(#sky4)"/>
      {/* Water ripples */}
      {[0,1,2].map(i=>(
        <ellipse key={i} cx="200" cy="140" rx={60+i*25} ry={20+i*8} fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="1"/>
      ))}
      {/* L-shape pond */}
      <polygon points="60,20 260,20 260,90 170,90 170,180 60,180"
        fill="rgba(59,130,246,0.22)" stroke="#3b82f6" strokeWidth="2.5"/>
      {/* Side labels */}
      <text x="160" y="14" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#f5b81a">10 m</text>
      <text x="268" y="57" textAnchor="start" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#f5b81a">6 m</text>
      <text x="218" y="104" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#f5b81a">9 m</text>
      <text x="172" y="140" textAnchor="start" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#ef4444">? m</text>
      <text x="113" y="194" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#f5b81a">3 m</text>
      <text x="46" y="103" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#f5b81a" transform="rotate(-90,46,103)">16 m</text>
      {/* Missing side badge */}
      <rect x="280" y="90" width="185" height="54" rx="10" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5"/>
      <text x="372" y="113" textAnchor="middle" fontFamily="Baloo 2" fontWeight="800" fontSize="12" fill="white">Missing side = ?</text>
      <text x="372" y="132" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#f5b81a">16 − 6 = 10 m</text>
      {/* Fish + duck */}
      <text x="120" y="165" fontSize="22">🐟</text>
      <text x="155" y="150" fontSize="20">🦆</text>
      {/* Mouse with magnifier */}
      <text x="68" y="210" fontSize="28">🐭</text>
      <text x="98" y="210" fontSize="20">🔍</text>
    </svg>
  );
}

const SLIDES = [
  {
    title: "Farmer Ben's Fence",
    illustration: <IllustrationFarm />,
    body: "Farmer Ben lives in the sunny countryside of Cornwall, England. He has a beautiful rectangular vegetable patch — 8 metres long and 5 metres wide. He wants to build a wooden fence all the way around it to keep the rabbits out! But how much fencing does he need? To find out, we must measure every side of the boundary.",
    pill: "✨  8 + 5 + 8 + 5 = ?  ✨",
    mascot: "Let's trace around the edge together! 🐭",
    narration: "Farmer Ben lives in the sunny countryside of Cornwall, England. He has a beautiful rectangular vegetable patch that is 8 metres long and 5 metres wide. He wants to build a wooden fence all the way around it to keep the rabbits out. But how much fencing does he need? To find out, we must measure every single side of the boundary.",
  },
  {
    title: "Walking the Boundary",
    illustration: <IllustrationBoundary />,
    body: "Mira puts on her tiny boots and walks all the way around the patch, counting every step! Top side: 8 m. Right side: 5 m. Bottom side: 8 m. Left side: 5 m. Adding them all together: 8 + 5 + 8 + 5 = 26 metres. That total distance around the outside is called the PERIMETER. Every outer side counts!",
    pill: "P = 8 + 5 + 8 + 5 = 26 m",
    mascot: "Perimeter = total distance all the way around! 🏃",
    narration: "Mira puts on her tiny boots and walks all the way around the patch, counting every step! She goes 8 metres along the top, 5 metres down the right side, 8 metres along the bottom, and 5 metres back up the left side. When she adds them all together she gets 26 metres. That total distance around the outside of a shape is called the perimeter!",
  },
  {
    title: "Oliver's Square Garden",
    illustration: <IllustrationSquare />,
    body: "Next door, Farmer Ben's neighbour Oliver has a perfect square flower garden. Every side is exactly 6 metres long. Because all four sides of a square are equal, there is a brilliant shortcut! Instead of adding 6 + 6 + 6 + 6, you can simply multiply: 4 × side. So 4 × 6 = 24 metres. This shortcut works for ANY square shape!",
    pill: "Square: P = 4 × 6 = 24 m",
    mascot: "Square shortcut: P = 4 × side! ✨",
    narration: "Next door, Farmer Ben's neighbour Oliver has a perfect square flower garden. Every side is exactly 6 metres long. Because all four sides of a square are always equal, there is a brilliant shortcut. Instead of adding 6 plus 6 plus 6 plus 6, you can simply multiply 4 times the side length. So 4 times 6 equals 24 metres. This shortcut works for any square!",
  },
  {
    title: "The Tricky L-Shaped Pond",
    illustration: <IllustrationLShape />,
    body: "At the edge of the farm is a beautiful L-shaped pond with 6 sides. One side length is hidden! Mira uses a secret rule: on any L-shaped figure, opposite sides must add up to match. The full left side is 16 m and the top-right notch is 6 m, so the missing side = 16 − 6 = 10 m. Then she adds all 6 outer sides to find the total perimeter!",
    pill: "Missing side = full side − notch",
    mascot: "Find missing sides using opposite-side rules! 🔍",
    narration: "At the edge of the farm is a beautiful L-shaped pond with 6 sides. But one side length is hidden! Mira knows a brilliant secret rule: on any L-shaped figure, opposite sides must add up to match each other. The full left side is 16 metres and the top-right notch is 6 metres, so the missing right side equals 16 minus 6 which is 10 metres. Then she adds all 6 outer sides together to find the complete perimeter!",
  },
];

export default function StoryPage() {
  const navigate = useNavigate();
  const { dispatch } = useGameState();
  const [idx, setIdx] = useState(0);
  const didNarrate = useRef(false);

  const narrate = (i) => {
    stopNarration();
    setTimeout(() => narrateText(SLIDES[i].narration, 'statement'), 450);
  };

  useEffect(() => {
    if (!didNarrate.current) { didNarrate.current = true; narrate(0); }
    return () => stopNarration();
  }, []);

  const goTo = (i) => { setIdx(i); narrate(i); };

  const handleNext = () => {
    if (idx < SLIDES.length - 1) { goTo(idx + 1); }
    else {
      stopNarration();
      dispatch({ type: 'COMPLETE_PHASE', phase: 'story' });
      navigate('/simulate');
    }
  };
  const handlePrev = () => { if (idx > 0) goTo(idx - 1); };

  const s = SLIDES[idx];
  const pct = Math.round(((idx + 1) / SLIDES.length) * 100);

  return (
    <PageShell phase="story">
      <div style={{ maxWidth: '660px', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>

        {/* Slide counter + progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
            Slide {idx + 1} of {SLIDES.length}
          </span>
          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                width: i === idx ? 22 : 9, height: 9, borderRadius: '9999px',
                background: i === idx ? 'var(--gold)' : i < idx ? 'var(--green)' : 'rgba(255,255,255,0.2)',
                border: 'none', cursor: 'pointer', transition: 'all 0.3s',
              }} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
          <span style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '0.78rem', color: 'var(--gold)' }}>{pct}%</span>
        </div>

        {/* Progress bar */}
        <div className="prog-track"><div className="prog-fill" style={{ width: `${pct}%` }} /></div>

        {/* Slide card */}
        <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {/* Illustration */}
          <div style={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
            {s.illustration}
          </div>

          {/* Title */}
          <h3 style={{ fontFamily: 'Baloo 2', fontWeight: 900, fontSize: '1.15rem', color: 'var(--gold)' }}>
            {s.title}
          </h3>

          {/* Body */}
          <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.88)' }}>
            {s.body}
          </p>

          {/* Formula pill */}
          <div className="formula-pill">{s.pill}</div>

          {/* Mascot tip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#f5b81a,#ffcc33)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
              boxShadow: '0 2px 8px rgba(245,184,26,0.4)',
            }}>🐭</div>
            <div style={{
              background: '#fff', color: '#1a1245', borderRadius: '0.75rem',
              borderBottomLeftRadius: '0.2rem', padding: '0.4rem 0.8rem',
              fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.8rem',
            }}>{s.mascot}</div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <button className="btn-ghost" onClick={handlePrev} disabled={idx === 0}>← Previous</button>
          <button className="btn-gold" onClick={handleNext} style={{ minWidth: '130px' }}>
            {idx < SLIDES.length - 1 ? 'Next →' : '🔬 Simulate!'}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
