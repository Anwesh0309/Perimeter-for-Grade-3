import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';

// ── Rich SVG Illustrations ────────────────────────────────
function Slide1Illustration() {
  return (
    <svg viewBox="0 0 480 200" style={{ width:'100%', borderRadius:'0.65rem', display:'block' }}>
      <defs>
        <linearGradient id="s1sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f"/><stop offset="100%" stopColor="#2d6a4f"/>
        </linearGradient>
        <pattern id="s1grass" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#2d6a4f"/>
        </pattern>
        <pattern id="s1grid" width="26" height="22" patternUnits="userSpaceOnUse">
          <rect width="26" height="22" fill="rgba(34,197,94,0.18)" stroke="rgba(34,197,94,0.4)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="480" height="200" fill="url(#s1sky)"/>
      <rect y="140" width="480" height="60" fill="url(#s1grass)"/>
      {/* Patch */}
      <rect x="60" y="40" width="208" height="110" fill="url(#s1grid)" stroke="#22c55e" strokeWidth="2.5" rx="3"/>
      {/* Fence posts top */}
      {[60,86,112,138,164,190,216,242,268].map(x=>(
        <rect key={x} x={x-2} y="32" width="4" height="18" fill="#92400e" rx="1"/>
      ))}
      {/* Fence rail top */}
      <line x1="58" y1="39" x2="270" y2="39" stroke="#b45309" strokeWidth="3"/>
      {/* Labels */}
      <text x="164" y="28" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="14" fill="#f5b81a">8 m</text>
      <text x="44" y="100" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#f5b81a" transform="rotate(-90,44,100)">5 m</text>
      <text x="164" y="168" textAnchor="middle" fontFamily="Baloo 2" fontWeight="700" fontSize="12" fill="rgba(255,255,255,0.4)">8 m</text>
      <text x="284" y="100" textAnchor="middle" fontFamily="Baloo 2" fontWeight="700" fontSize="12" fill="rgba(255,255,255,0.4)" transform="rotate(90,284,100)">5 m</text>
      {/* Carrots */}
      {[85,115,145,175,205,235].map(x=><text key={x} x={x} y={90} fontSize="16">🥕</text>)}
      {/* Farmer */}
      <text x="350" y="155" fontSize="52">👨‍🌾</text>
      {/* Mouse */}
      <text x="65" y="170" fontSize="32">🐭</text>
      {/* Rabbit */}
      <text x="310" y="170" fontSize="26">🐰</text>
      {/* Question bubble */}
      <rect x="310" y="80" width="155" height="34" rx="8" fill="white"/>
      <text x="388" y="102" textAnchor="middle" fontFamily="Nunito" fontWeight="800" fontSize="12" fill="#1a1245">How much fencing?</text>
    </svg>
  );
}

function Slide2Illustration() {
  return (
    <svg viewBox="0 0 480 200" style={{ width:'100%', borderRadius:'0.65rem', display:'block' }}>
      <defs>
        <linearGradient id="s2sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1245"/><stop offset="100%" stopColor="#2d4a3e"/>
        </linearGradient>
      </defs>
      <rect width="480" height="200" fill="url(#s2sky)"/>
      {/* Patch outline */}
      <rect x="60" y="35" width="210" height="120" fill="rgba(34,197,94,0.08)" stroke="#22c55e" strokeWidth="2" rx="3"/>
      {/* Animated dotted perimeter */}
      <rect x="60" y="35" width="210" height="120" fill="none" stroke="#f5b81a" strokeWidth="3.5" strokeDasharray="10,6" rx="3"/>
      {/* Running total callouts */}
      <rect x="100" y="14" width="115" height="20" rx="5" fill="rgba(245,184,26,0.2)" stroke="rgba(245,184,26,0.5)"/>
      <text x="157" y="28" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill="#f5b81a">Top: 8m → 8</text>
      <rect x="278" y="68" width="118" height="20" rx="5" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.5)"/>
      <text x="337" y="82" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill="#22c55e">+5m → 13</text>
      <rect x="80" y="165" width="120" height="20" rx="5" fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.5)"/>
      <text x="140" y="179" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill="#93c5fd">+8m → 21</text>
      <rect x="10" y="68" width="115" height="20" rx="5" fill="rgba(236,72,153,0.2)" stroke="rgba(236,72,153,0.5)"/>
      <text x="67" y="82" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill="#f9a8d4">+5m = 26! 🎉</text>
      {/* Big answer badge */}
      <rect x="140" y="70" width="140" height="42" rx="10" fill="rgba(245,184,26,0.18)" stroke="rgba(245,184,26,0.6)" strokeWidth="2"/>
      <text x="210" y="88" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="white">Perimeter</text>
      <text x="210" y="106" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="15" fill="#f5b81a">= 26 m ✓</text>
      {/* Mouse walking */}
      <text x="62" y="175" fontSize="28">🐭</text>
      <text x="258" y="170" fontSize="20">👟</text>
    </svg>
  );
}

function Slide3Illustration() {
  return (
    <svg viewBox="0 0 480 200" style={{ width:'100%', borderRadius:'0.65rem', display:'block' }}>
      <defs>
        <linearGradient id="s3sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b"/><stop offset="100%" stopColor="#312e81"/>
        </linearGradient>
        <pattern id="s3flowers" width="28" height="24" patternUnits="userSpaceOnUse">
          <rect width="28" height="24" fill="rgba(236,72,153,0.1)"/>
          <text x="4" y="20" fontSize="16">🌸</text>
        </pattern>
      </defs>
      <rect width="480" height="200" fill="url(#s3sky)"/>
      {/* Square garden */}
      <rect x="90" y="20" width="170" height="155" fill="url(#s3flowers)" stroke="#ec4899" strokeWidth="2.5" rx="4"/>
      <rect x="90" y="20" width="170" height="155" fill="none" stroke="#f5b81a" strokeWidth="2" strokeDasharray="7,4" rx="4"/>
      {/* Labels */}
      <text x="175" y="14" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="14" fill="#f5b81a">6 m</text>
      <text x="78" y="103" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#f5b81a" transform="rotate(-90,78,103)">6 m</text>
      <text x="175" y="192" textAnchor="middle" fontFamily="Baloo 2" fontWeight="700" fontSize="12" fill="rgba(255,255,255,0.4)">6 m</text>
      <text x="274" y="103" textAnchor="middle" fontFamily="Baloo 2" fontWeight="700" fontSize="12" fill="rgba(255,255,255,0.4)" transform="rotate(90,274,103)">6 m</text>
      {/* Shortcut badge */}
      <rect x="290" y="55" width="170" height="60" rx="10" fill="rgba(245,184,26,0.15)" stroke="rgba(245,184,26,0.5)" strokeWidth="1.5"/>
      <text x="375" y="78" textAnchor="middle" fontFamily="Baloo 2" fontWeight="800" fontSize="13" fill="white">✨ Shortcut!</text>
      <text x="375" y="98" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="14" fill="#f5b81a">4 × 6 = 24 m</text>
      {/* Oliver */}
      <text x="345" y="165" fontSize="42">👴</text>
      {/* Mouse */}
      <text x="98" y="192" fontSize="26">🐭</text>
    </svg>
  );
}

function Slide4Illustration() {
  return (
    <svg viewBox="0 0 480 200" style={{ width:'100%', borderRadius:'0.65rem', display:'block' }}>
      <defs>
        <linearGradient id="s4sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1445"/><stop offset="100%" stopColor="#1a3a5c"/>
        </linearGradient>
      </defs>
      <rect width="480" height="200" fill="url(#s4sky)"/>
      {/* Water ripples */}
      {[0,1,2].map(i=><ellipse key={i} cx="175" cy="130" rx={55+i*22} ry={16+i*7} fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="1"/>)}
      {/* L-shape */}
      <polygon points="40,15 250,15 250,80 165,80 165,170 40,170" fill="rgba(59,130,246,0.22)" stroke="#3b82f6" strokeWidth="2.5"/>
      {/* Side labels */}
      <text x="145" y="10" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#f5b81a">10 m</text>
      <text x="258" y="50" textAnchor="start" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill="#f5b81a">6 m</text>
      <text x="212" y="94" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill="#f5b81a">9 m</text>
      <text x="167" y="130" textAnchor="start" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#ef4444">? m</text>
      <text x="100" y="184" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill="#f5b81a">3 m</text>
      <text x="26" y="98" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill="#f5b81a" transform="rotate(-90,26,98)">16 m</text>
      {/* Missing-side reveal */}
      <rect x="268" y="75" width="195" height="52" rx="10" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5"/>
      <text x="365" y="97" textAnchor="middle" fontFamily="Baloo 2" fontWeight="800" fontSize="12" fill="white">Missing side = ?</text>
      <text x="365" y="116" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#f5b81a">16 − 6 = 10 m ✓</text>
      {/* Fish + duck */}
      <text x="110" y="155" fontSize="20">🐟</text>
      <text x="148" y="148" fontSize="18">🦆</text>
      {/* Mouse */}
      <text x="44" y="188" fontSize="26">🐭</text>
      <text x="74" y="188" fontSize="18">🔍</text>
    </svg>
  );
}

// ── Slide data ────────────────────────────────────────────
const SLIDES = [
  {
    title: "Farmer Ben's Fence",
    illustration: <Slide1Illustration />,
    body: "Farmer Ben lives in the sunny countryside of Cornwall, England. He has a beautiful rectangular vegetable patch — 8 metres long and 5 metres wide. He wants to build a wooden fence all the way around it to keep the rabbits out! To find out how much fencing he needs, we must measure every single side of the boundary.",
    pill: "✨  8 + 5 + 8 + 5 = ?  ✨",
    mascot: "Let's trace around the edge together! 🐭",
    narration: "Farmer Ben lives in the sunny countryside of Cornwall, England. He has a beautiful rectangular vegetable patch that is 8 metres long and 5 metres wide. He wants to build a wooden fence all the way around it to keep the rabbits out. But how much fencing does he need? To find out, we must measure every single side of the boundary.",
  },
  {
    title: "Walking the Boundary",
    illustration: <Slide2Illustration />,
    body: "Mira puts on her tiny boots and walks all the way around the patch, counting every step! Top: 8 m. Right: 5 m. Bottom: 8 m. Left: 5 m. Total: 8 + 5 + 8 + 5 = 26 metres. That total distance around the outside of any shape is called the PERIMETER. Every outer side must be included!",
    pill: "P = 8 + 5 + 8 + 5 = 26 m",
    mascot: "Perimeter = total distance all the way around! 🏃",
    narration: "Mira puts on her tiny boots and walks all the way around the patch, counting every step! She goes 8 metres along the top, 5 metres down the right side, 8 metres along the bottom, and 5 metres back up the left side. When she adds them all together she gets 26 metres. That total distance around the outside of a shape is called the perimeter!",
  },
  {
    title: "Oliver's Square Garden",
    illustration: <Slide3Illustration />,
    body: "Next door, Farmer Ben's neighbour Oliver has a perfect square flower garden. Every side is exactly 6 metres long. Since all four sides of a square are equal, there is a brilliant shortcut! Instead of adding 6 + 6 + 6 + 6, simply multiply: 4 × side length. So 4 × 6 = 24 metres. This shortcut works for ANY square!",
    pill: "Square: P = 4 × 6 = 24 m",
    mascot: "Square shortcut: P = 4 × side! ✨",
    narration: "Next door, Farmer Ben's neighbour Oliver has a perfect square flower garden. Every side is exactly 6 metres long. Because all four sides of a square are always equal, there is a brilliant shortcut. Instead of adding 6 plus 6 plus 6 plus 6, you can simply multiply 4 times the side length. So 4 times 6 equals 24 metres. This shortcut works for any square!",
  },
  {
    title: "The Tricky L-Shaped Pond",
    illustration: <Slide4Illustration />,
    body: "At the edge of the farm is an L-shaped pond with 6 sides — but one side is hidden! Mira uses a secret rule: on any L-shaped figure, opposite sides must add up to match. The full left side is 16 m and the top-right notch is 6 m, so the missing side = 16 − 6 = 10 m. Then add all 6 outer sides to get the full perimeter!",
    pill: "Missing side = full side − notch",
    mascot: "Find missing sides using opposite-side rules! 🔍",
    narration: "At the edge of the farm is a beautiful L-shaped pond with 6 sides. But one side length is hidden! Mira knows a brilliant secret rule: on any L-shaped figure, opposite sides must add up to match each other. The full left side is 16 metres and the top-right notch is 6 metres, so the missing right side equals 16 minus 6, which is 10 metres. Then she adds all 6 outer sides together to find the complete perimeter!",
  },
];

// ── StoryPage ─────────────────────────────────────────────
export default function StoryPage() {
  const navigate = useNavigate();
  const { dispatch } = useGameState();
  const [idx, setIdx] = useState(0);
  const narrateRef = useRef(null); // tracks pending narration timer

  // Narrate only the current slide — stop any previous audio first
  const narrate = (i) => {
    // Cancel any pending timer
    if (narrateRef.current) { clearTimeout(narrateRef.current); narrateRef.current = null; }
    // Hard-stop whatever is playing
    stopNarration();
    // Schedule new narration
    narrateRef.current = setTimeout(() => {
      narrateText(SLIDES[i].narration, 'statement');
    }, 450);
  };

  // Start narration on mount; stop fully on unmount
  useEffect(() => {
    narrate(0);
    return () => {
      if (narrateRef.current) clearTimeout(narrateRef.current);
      stopNarration(); // ← prevents audio bleeding into next phase
    };
  }, []);

  const goTo = (i) => { setIdx(i); narrate(i); };

  const handleNext = () => {
    if (idx < SLIDES.length - 1) {
      goTo(idx + 1);
    } else {
      // Stop before navigating so no overlap with Simulate narration
      if (narrateRef.current) clearTimeout(narrateRef.current);
      stopNarration();
      dispatch({ type: 'COMPLETE_PHASE', phase: 'story' });
      navigate('/simulate');
    }
  };

  const handlePrev = () => { if (idx > 0) goTo(idx - 1); };

  const s   = SLIDES[idx];
  const pct = Math.round(((idx + 1) / SLIDES.length) * 100);

  return (
    <PageShell phase="story">
      <div style={{
        maxWidth: '780px', width: '100%',
        display: 'flex', flexDirection: 'column', gap: '0.6rem',
      }}>

        {/* Progress row */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <span style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.75rem',
            color:'rgba(255,255,255,0.45)', whiteSpace:'nowrap' }}>
            Slide {idx + 1} of {SLIDES.length}
          </span>
          <div className="prog-track" style={{ flex:1 }}>
            <div className="prog-fill" style={{ width:`${pct}%` }}/>
          </div>
          {/* Dot indicators */}
          <div style={{ display:'flex', gap:'0.35rem', alignItems:'center' }}>
            {SLIDES.map((_,i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                width: i===idx ? 20 : 8, height: 8, borderRadius:'9999px', border:'none',
                background: i===idx ? 'var(--gold)' : i<idx ? 'var(--green)' : 'rgba(255,255,255,0.2)',
                cursor:'pointer', transition:'all 0.3s', padding:0,
              }} aria-label={`Slide ${i+1}`}/>
            ))}
          </div>
          <span style={{ fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.75rem',
            color:'var(--gold)', whiteSpace:'nowrap' }}>{pct}%</span>
        </div>

        {/* Slide card — horizontal split: illustration left, content right */}
        <div className="card" style={{
          display:'grid', gridTemplateColumns:'1fr 1fr',
          gap:0, overflow:'hidden',
          minHeight:'280px',
        }}>
          {/* Illustration */}
          <div style={{
            background:'rgba(0,0,0,0.25)',
            display:'flex', alignItems:'center', justifyContent:'center',
            padding:'0.75rem',
          }}>
            {s.illustration}
          </div>

          {/* Content */}
          <div style={{
            padding:'1rem 1.1rem',
            display:'flex', flexDirection:'column',
            justifyContent:'space-between', gap:'0.6rem',
            borderLeft:'1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              <h3 style={{ fontFamily:'Baloo 2', fontWeight:900, fontSize:'1.15rem',
                color:'var(--gold)', lineHeight:1.15 }}>
                {s.title}
              </h3>
              <p style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.84rem',
                lineHeight:1.55, color:'rgba(255,255,255,0.88)' }}>
                {s.body}
              </p>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem' }}>
              {/* Formula pill */}
              <div className="formula-pill" style={{ fontSize:'0.9rem' }}>{s.pill}</div>

              {/* Mascot tip */}
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <div style={{
                  width:34, height:34, borderRadius:'50%', flexShrink:0,
                  background:'linear-gradient(135deg,#f5b81a,#ffcc33)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'1rem', boxShadow:'0 2px 8px rgba(245,184,26,0.4)',
                }}>🐭</div>
                <div style={{
                  background:'#fff', color:'#1a1245',
                  borderRadius:'0.65rem', borderBottomLeftRadius:'0.15rem',
                  padding:'0.38rem 0.7rem',
                  fontFamily:'Nunito', fontWeight:700, fontSize:'0.78rem',
                }}>{s.mascot}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.75rem' }}>
          <button className="btn-ghost" onClick={handlePrev} disabled={idx === 0}
            style={{ opacity: idx===0 ? 0.3 : 1, minWidth:'100px' }}>
            ← Back
          </button>
          <button className="btn-gold" onClick={handleNext} style={{ minWidth:'130px' }}>
            {idx < SLIDES.length - 1 ? 'Next →' : '🔬 Simulate!'}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
