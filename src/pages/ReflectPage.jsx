import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepperNav from '../components/StepperNav';
import ScoreRing from '../components/ScoreRing';
import ConfettiBurst from '../components/ConfettiBurst';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';
import { getReflectNarration } from '../utils/narration';
import { worlds } from '../data/worlds';

function StarRow({ count }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1, 2, 3].map(i => <span key={i} style={{ fontSize: '0.9rem', opacity: i <= count ? 1 : 0.2 }}>⭐</span>)}
    </div>
  );
}

export default function ReflectPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useGameState();

  const totalCorrect = Object.values(state.worlds).reduce((s, w) => s + (w.correctCount || 0), 0);
  const totalQuestions = 100;
  const percentage = Math.round((totalCorrect / totalQuestions) * 100);
  const worldsMastered = Object.values(state.worlds).filter(w => w.starsEarned >= 2).length;

  useEffect(() => {
    dispatch({ type: 'COMPLETE_PHASE', phase: 'reflect' });
    const text = getReflectNarration(percentage);
    const t = setTimeout(() => narrateText(text, percentage >= 70 ? 'celebration' : 'encouragement'), 800);
    return () => { clearTimeout(t); stopNarration(); };
  }, []);

  const mascotMsg = percentage >= 90
    ? "Perimeter Pro! You measured everything perfectly! 🏆"
    : percentage >= 70
    ? "Brilliant work! You're a great shape measurer! 📐"
    : percentage >= 50
    ? "Great effort! Keep practising to master every world! 💪"
    : "Well done for finishing! Try again to improve your score! 🐭";

  const handlePlayAgain = () => {
    dispatch({ type: 'PLAY_AGAIN' });
    navigate('/');
  };

  return (
    <div className="app-container">
      <StepperNav currentPhase="reflect" />
      <ConfettiBurst active={percentage >= 50} />

      <div className="phase-content">
        <div style={{ maxWidth: '640px', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>

          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>🏆</div>
            <h2 style={{ fontFamily: 'Baloo 2', fontWeight: 900, fontSize: '1.8rem', color: '#f5b81a', lineHeight: 1.1 }}>
              Journey Complete!
            </h2>
            <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
              You finished all 5 phases!
            </p>
          </div>

          {/* Score + stats row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <ScoreRing percentage={percentage} fraction={`${totalCorrect}/${totalQuestions}`} size={150} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                ['⚡', 'XP Earned', `${state.xp} XP`],
                ['🔥', 'Max Streak', `${state.maxStreak}`],
                ['🌍', 'Worlds Mastered', `${worldsMastered}/10`],
              ].map(([icon, label, val]) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '0.75rem', padding: '0.4rem 0.8rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '160px'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '0.9rem', color: '#f5b81a' }}>{val}</div>
                    <div style={{ fontFamily: 'Nunito', fontWeight: 600, fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stars row */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.8rem', opacity: i <= (percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0) ? 1 : 0.2 }}>⭐</span>
              </div>
            ))}
          </div>

          {/* Per-world results */}
          <div className="glass-card" style={{ padding: '0.75rem' }}>
            <h3 style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '0.95rem', color: '#f5b81a', marginBottom: '0.5rem', textAlign: 'center' }}>
              World Results
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.35rem' }}>
              {worlds.map(w => {
                const ws = state.worlds[w.id];
                const correct = ws?.correctCount || 0;
                const stars = ws?.starsEarned || 0;
                const attempted = ws?.attempted;
                return (
                  <div key={w.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem',
                    padding: '0.35rem 0.6rem',
                    border: `1px solid ${attempted ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.07)'}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1rem' }}>{w.icon}</span>
                      <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>{w.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '0.75rem', color: '#22c55e' }}>{correct}/10</span>
                      <StarRow count={stars} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mascot */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#f5b81a,#ffcc33)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
              boxShadow: '0 4px 12px rgba(245,184,26,0.5)'
            }}>🐭</div>
            <div style={{
              background: 'white', color: '#1a1245', borderRadius: '0.75rem',
              borderBottomLeftRadius: '0.2rem', padding: '0.5rem 0.9rem',
              fontFamily: 'Nunito', fontWeight: 800, fontSize: '0.85rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              {mascotMsg}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-gold" onClick={handlePlayAgain} style={{ flex: 1, padding: '0.8rem', fontSize: '1rem' }}>
              🔄 Play Again
            </button>
            <button className="btn-secondary" onClick={() => navigate('/')} style={{ flex: 1, padding: '0.8rem', fontSize: '1rem' }}>
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
