import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import StepperNav from '../components/StepperNav';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';
import { worlds } from '../data/worlds';

function Stars({ count }) {
  return (
    <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
      {[1, 2, 3].map(i => (
        <span key={i} style={{ fontSize: '0.8rem', opacity: i <= count ? 1 : 0.25 }}>⭐</span>
      ))}
    </div>
  );
}

export default function WorldSelectPage() {
  const navigate = useNavigate();
  const { state } = useGameState();

  useEffect(() => {
    const t = setTimeout(() => narrateText(
      'Welcome to the Play phase! Choose a world to begin your perimeter challenge. Complete each world to unlock the next one. Good luck!',
      'encouragement'
    ), 500);
    return () => { clearTimeout(t); stopNarration(); };
  }, []);

  const totalCorrect = Object.values(state.worlds).reduce((s, w) => s + (w.correctCount || 0), 0);
  const totalStars = Object.values(state.worlds).reduce((s, w) => s + (w.starsEarned || 0), 0);

  return (
    <div className="app-container">
      <StepperNav currentPhase="play" />
      <div className="phase-content">
        <div style={{ maxWidth: '700px', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>

          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Baloo 2', fontWeight: 900, fontSize: '1.6rem', color: '#f5b81a' }}>🎮 04 — Play</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito', fontWeight: 600, fontSize: '0.8rem' }}>Choose Your World! Answer questions to earn stars and XP.</p>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              ['⭐', 'Stars', `${totalStars}/30`],
              ['🔥', 'Streak', `${state.streak}`],
              ['✅', 'Correct', `${totalCorrect}/100`],
              ['⚡', 'XP', `${state.xp}`],
            ].map(([icon, label, val]) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '0.75rem', padding: '0.4rem 0.8rem', textAlign: 'center', minWidth: '70px'
              }}>
                <div style={{ fontSize: '1.2rem' }}>{icon}</div>
                <div style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '0.85rem', color: '#f5b81a' }}>{val}</div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* World grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '0.5rem' }}>
            {worlds.map(w => {
              const ws = state.worlds[w.id];
              const locked = !ws.unlocked;
              const attempted = ws.attempted;
              const stars = ws.starsEarned || 0;

              return (
                <div key={w.id}
                  className={`world-card ${locked ? 'locked' : ''} ${attempted ? 'completed' : ''}`}
                  onClick={() => !locked && navigate(`/play/${w.id}`)}
                  style={{ borderColor: attempted ? '#22c55e' : locked ? undefined : w.color + '80' }}
                >
                  {locked && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: '1rem', zIndex: 1 }}>
                      <span style={{ fontSize: '1.4rem' }}>🔒</span>
                    </div>
                  )}
                  <div style={{ fontSize: '1.6rem' }}>{w.icon}</div>
                  <div style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '0.7rem', color: 'white', lineHeight: 1.2 }}>{w.name}</div>
                  <div style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>Q{(w.id - 1) * 10 + 1}–{w.id * 10}</div>
                  <Stars count={stars} />
                  {!locked && (
                    <div style={{
                      background: attempted ? '#22c55e' : '#ec4899',
                      color: 'white', borderRadius: '9999px',
                      padding: '0.2rem 0.6rem', fontSize: '0.65rem', fontFamily: 'Baloo 2', fontWeight: 800
                    }}>
                      {attempted ? '↺ Retry' : '▶ PLAY'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* All attempted → go to Reflect */}
          {Object.values(state.worlds).every(w => w.attempted) && (
            <button className="btn-gold" onClick={() => navigate('/reflect')} style={{ width: '100%' }}>
              🏆 See Your Results!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
