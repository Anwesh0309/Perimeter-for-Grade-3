import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration, setMuted, syncMuteState } from '../utils/audio';

// Inline particles for home page (no top-bar on home)
function BgParticles() {
  const items = Array.from({ length: 28 }, (_, i) => ({
    id: i, size: 2 + (i * 7) % 6, left: (i * 37 + 11) % 100,
    dur: 12 + (i * 5) % 14, delay: (i * 3) % 11, op: 0.1 + (i % 5) * 0.07,
  }));
  return (
    <>
      {items.map(p => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size, left: `${p.left}%`, bottom: '-20px',
          animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
          opacity: p.op, zIndex: 0,
        }} />
      ))}
    </>
  );
}

const JOURNEY = [
  { icon: '🔍', label: 'Wonder',   desc: 'Spark your curiosity' },
  { icon: '📖', label: 'Story',    desc: "Mira's measuring mission" },
  { icon: '🔬', label: 'Simulate', desc: 'Build & measure shapes' },
  { icon: '🎮', label: 'Play',     desc: 'Test your skills' },
  { icon: '🏆', label: 'Reflect',  desc: "See how far you've come" },
];

const FEATURES = [
  { icon: '📐', label: 'Shape Lab',     sub: 'Interactive builder' },
  { icon: '🧱', label: '4 Simulations', sub: 'Hands-on stations' },
  { icon: '🏰', label: '10 Game Worlds',sub: '100 questions total' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useGameState();

  const timerRef = useRef(null);

  useEffect(() => {
    syncMuteState(state.muted);
    stopNarration();
    timerRef.current = setTimeout(() => {
      narrateText(
        "Welcome to Perimeter Quest! I am Mira the Measuring Mouse. Join me on an adventure to learn all about perimeter — the distance around shapes. We will explore through stories, simulations, and exciting games. Ready to begin your journey?",
        'statement'
      );
    }, 700);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      stopNarration();
    };
  }, []);

  const handleMute = () => {
    const next = !state.muted;
    dispatch({ type: 'SET_MUTED', muted: next });
    setMuted(next); // setMuted already calls stopNarration internally when muting
  };

  return (
    <div className="app-shell" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <BgParticles />

      {/* Mute — floating bottom-right */}
      <button className="mute-btn" onClick={handleMute} aria-label={state.muted ? 'Unmute' : 'Mute'}>
        {state.muted ? '🔇' : '🔊'}
      </button>

      {/* Centre card — matches reference exactly */}
      <div style={{
        maxWidth: '540px', width: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem',
        padding: '0 1rem', zIndex: 1,
      }}>

        {/* Curriculum badge */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '9999px', padding: '0.28rem 0.9rem',
          fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.75)', letterSpacing: '0.04em',
        }}>
          ✨ Grade 3 Mathematics — Perimeter Adventure
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'Baloo 2', fontWeight: 900,
          fontSize: 'clamp(2.2rem,6vw,3.4rem)', lineHeight: 1.1,
          textAlign: 'center', letterSpacing: '-0.01em',
        }}>
          <span style={{ color: '#fff' }}>Perimeter </span>
          <span style={{ color: 'var(--gold)' }}>Quest</span>
        </h1>

        {/* Mascot row */}
        <div className="mascot-row">
          <div className="mascot-avatar" style={{ width: 52, height: 52, fontSize: '1.7rem' }}>🐭</div>
          <div className="speech-bubble">Ready to measure some shapes? 📏</div>
        </div>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.65)', textAlign: 'center', maxWidth: '380px',
        }}>
          Join Mira and discover how measuring the edges of shapes unlocks the secret of perimeter — through stories, simulations, and exciting games!
        </p>

        {/* Journey steps — reference style: pill row with arrows */}
        <div className="card" style={{ width: '100%', padding: '0.8rem 1rem' }}>
          <div style={{
            fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.4)', textAlign: 'center',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.55rem',
          }}>
            Your Learning Journey
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.25rem', flexWrap: 'wrap',
          }}>
            {JOURNEY.map((j, i) => {
              const done = state.phaseStatus[j.label.toLowerCase()];
              return (
                <div key={j.label} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {i > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>→</span>}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.28rem',
                    padding: '0.28rem 0.65rem',
                    background: done ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${done ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: '9999px',
                    fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '0.72rem',
                    color: done ? 'var(--green)' : 'rgba(255,255,255,0.75)',
                  }}>
                    <span>{j.icon}</span>
                    <span>{j.label}</span>
                    {done && <span>✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <button className="btn-gold" style={{ width: '100%', maxWidth: '320px', fontSize: '1.1rem', padding: '0.9rem 2rem' }}
          onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); stopNarration(); navigate('/wonder'); }}>
          🚀 Begin Your Journey!
        </button>

        {/* Feature chips */}
        <div style={{ display: 'flex', gap: '0.55rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {FEATURES.map(f => (
            <div key={f.label} className="card" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
              padding: '0.6rem 0.9rem', minWidth: '110px',
            }}>
              <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
              <span style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '0.75rem', color: '#fff' }}>{f.label}</span>
              <span style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)' }}>{f.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
