import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';

// ── Slide data — each slide uses the real image from /public/images/ ─
const SLIDES = [
  {
    title: "Farmer Ben's Fence",
    image: '/images/story_farm.png',
    body: "Farmer Ben lives in the sunny countryside of Cornwall, England. He has a beautiful rectangular vegetable patch — 8 metres long and 5 metres wide. He wants to build a wooden fence all the way around it to keep the rabbits out! To find out how much fencing he needs, we must measure every single side of the boundary.",
    pill: '✨  8 + 5 + 8 + 5 = ?  ✨',
    mascot: "Let's trace around the edge together! 🐭",
    narration:
      'Farmer Ben lives in the sunny countryside of Cornwall, England. He has a beautiful rectangular vegetable patch that is 8 metres long and 5 metres wide. He wants to build a wooden fence all the way around it to keep the rabbits out. But how much fencing does he need? To find out, we must measure every single side of the boundary.',
  },
  {
    title: 'Walking the Boundary',
    image: '/images/story_boundary.png',
    body: 'Mira puts on her tiny boots and walks all the way around the patch, counting every step! Top: 8 m. Right: 5 m. Bottom: 8 m. Left: 5 m. Total: 8 + 5 + 8 + 5 = 26 metres. That total distance around the outside of any shape is called the PERIMETER. Every outer side must be included!',
    pill: 'P = 8 + 5 + 8 + 5 = 26 m',
    mascot: 'Perimeter = total distance all the way around! 🏃',
    narration:
      'Mira puts on her tiny boots and walks all the way around the patch, counting every step! She goes 8 metres along the top, 5 metres down the right side, 8 metres along the bottom, and 5 metres back up the left side. When she adds them all together she gets 26 metres. That total distance around the outside of a shape is called the perimeter!',
  },
  {
    title: "Oliver's Square Garden",
    image: '/images/story_square.png',
    body: "Next door, Farmer Ben's neighbour Oliver has a perfect square flower garden. Every side is exactly 6 metres long. Since all four sides of a square are equal, there is a brilliant shortcut! Instead of adding 6 + 6 + 6 + 6, simply multiply: 4 × side length. So 4 × 6 = 24 metres. This shortcut works for ANY square!",
    pill: 'Square: P = 4 × 6 = 24 m',
    mascot: 'Square shortcut: P = 4 × side! ✨',
    narration:
      'Next door, Farmer Ben\'s neighbour Oliver has a perfect square flower garden. Every side is exactly 6 metres long. Because all four sides of a square are always equal, there is a brilliant shortcut. Instead of adding 6 plus 6 plus 6 plus 6, you can simply multiply 4 times the side length. So 4 times 6 equals 24 metres. This shortcut works for any square!',
  },
  {
    title: 'The Tricky L-Shaped Pond',
    image: '/images/story_lshape.png',
    body: "At the edge of the farm is an L-shaped pond with 6 sides — but one side is hidden! Mira uses a secret rule: on any L-shaped figure, opposite sides must add up to match. The full left side is 16 m and the top-right notch is 6 m, so the missing side = 16 − 6 = 10 m. Then add all 6 outer sides to get the full perimeter!",
    pill: 'Missing side = full side − notch',
    mascot: 'Find missing sides using opposite-side rules! 🔍',
    narration:
      'At the edge of the farm is a beautiful L-shaped pond with 6 sides. But one side length is hidden! Mira knows a brilliant secret rule: on any L-shaped figure, opposite sides must add up to match each other. The full left side is 16 metres and the top-right notch is 6 metres, so the missing right side equals 16 minus 6, which is 10 metres. Then she adds all 6 outer sides together to find the complete perimeter!',
  },
];

// ── StoryPage ─────────────────────────────────────────────
export default function StoryPage() {
  const navigate = useNavigate();
  const { dispatch } = useGameState();
  const [idx, setIdx] = useState(0);
  const narrateTimerRef = useRef(null);

  // Stop previous audio, schedule new narration for slide i
  const narrate = (i) => {
    if (narrateTimerRef.current) clearTimeout(narrateTimerRef.current);
    stopNarration();
    narrateTimerRef.current = setTimeout(() => {
      narrateText(SLIDES[i].narration, 'statement');
    }, 450);
  };

  // Start narration on mount; fully stop on unmount (no bleed to next phase)
  useEffect(() => {
    narrate(0);
    return () => {
      if (narrateTimerRef.current) clearTimeout(narrateTimerRef.current);
      stopNarration();
    };
  }, []);

  const goTo = (i) => { setIdx(i); narrate(i); };

  const handleNext = () => {
    if (idx < SLIDES.length - 1) {
      goTo(idx + 1);
    } else {
      if (narrateTimerRef.current) clearTimeout(narrateTimerRef.current);
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
        maxWidth: '820px', width: '100%',
        display: 'flex', flexDirection: 'column', gap: '0.6rem',
      }}>

        {/* ── Progress row ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap',
          }}>
            Slide {idx + 1} of {SLIDES.length}
          </span>
          <div className="prog-track" style={{ flex: 1 }}>
            <div className="prog-fill" style={{ width: `${pct}%` }} />
          </div>
          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                width: i === idx ? 20 : 8, height: 8,
                borderRadius: '9999px', border: 'none', padding: 0,
                background: i === idx ? 'var(--gold)' : i < idx ? 'var(--green)' : 'rgba(255,255,255,0.2)',
                cursor: 'pointer', transition: 'all 0.3s',
              }} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
          <span style={{
            fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '0.75rem',
            color: 'var(--gold)', whiteSpace: 'nowrap',
          }}>{pct}%</span>
        </div>

        {/* ── Slide card: image left | content right ── */}
        <div className="card" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          overflow: 'hidden',
          minHeight: '280px',
        }}>

          {/* Left — real photo/illustration */}
          <div style={{
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)',
            background: 'rgba(0,0,0,0.3)',
          }}>
            <img
              key={s.image}            /* key forces re-render on slide change */
              src={s.image}
              alt={s.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                minHeight: '240px',
                maxHeight: '340px',
              }}
            />
          </div>

          {/* Right — text content */}
          <div style={{
            padding: '1rem 1.15rem',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', gap: '0.6rem',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
          }}>
            {/* Title + body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{
                fontFamily: 'Baloo 2', fontWeight: 900, fontSize: '1.15rem',
                color: 'var(--gold)', lineHeight: 1.15,
              }}>
                {s.title}
              </h3>
              <p style={{
                fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.85rem',
                lineHeight: 1.55, color: 'rgba(255,255,255,0.88)',
              }}>
                {s.body}
              </p>
            </div>

            {/* Formula pill + mascot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <div className="formula-pill" style={{ fontSize: '0.9rem' }}>{s.pill}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#f5b81a,#ffcc33)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', boxShadow: '0 2px 8px rgba(245,184,26,0.4)',
                }}>🐭</div>
                <div style={{
                  background: '#fff', color: '#1a1245',
                  borderRadius: '0.65rem', borderBottomLeftRadius: '0.15rem',
                  padding: '0.38rem 0.7rem',
                  fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.78rem',
                }}>{s.mascot}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '0.75rem',
        }}>
          <button
            className="btn-ghost"
            onClick={handlePrev}
            disabled={idx === 0}
            style={{ opacity: idx === 0 ? 0.3 : 1, minWidth: '100px' }}
          >
            ← Back
          </button>
          <button
            className="btn-gold"
            onClick={handleNext}
            style={{ minWidth: '130px' }}
          >
            {idx < SLIDES.length - 1 ? 'Next →' : '🔬 Simulate!'}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
