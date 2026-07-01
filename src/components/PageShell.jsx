// PageShell — wraps every phase page with:
//   • top-bar: [Home btn] [stepper] (no Home on landing page)
//   • floating mute button bottom-right
//   • particle background
//   • full-screen no-scroll layout
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../context/GameStateContext';
import { setMuted, syncMuteState, stopNarration } from '../utils/audio';

const STEPS = [
  { key:'wonder',   num:'01', label:'Wonder',   icon:'🔍' },
  { key:'story',    num:'02', label:'Story',     icon:'📖' },
  { key:'simulate', num:'03', label:'Simulate',  icon:'🔬' },
  { key:'play',     num:'04', label:'Play',      icon:'🎮' },
  { key:'reflect',  num:'05', label:'Reflect',   icon:'🏆' },
];
const ORDER = STEPS.map(s => s.key);

export default function PageShell({ phase, children }) {
  const navigate   = useNavigate();
  const { state, dispatch } = useGameState();
  const currentIdx = ORDER.indexOf(phase);

  // Sync the audio engine's mute flag every time the component renders
  // (handles page navigation where the module-level flag could drift from state)
  useEffect(() => {
    syncMuteState(state.muted);
  }, [state.muted]);

  const handleMute = () => {
    const next = !state.muted;
    dispatch({ type:'SET_MUTED', muted: next });
    setMuted(next); // immediately updates engine + stops audio if muting
  };

  return (
    <div className="app-shell">
      {/* ── BACKGROUND PARTICLES ── */}
      <Particles />

      {/* ── TOP BAR ── */}
      <div className="top-bar">
        {/* Home button */}
        <button className="home-btn" onClick={() => { stopNarration(); navigate('/'); }}>
          🏠 Home
        </button>

        {/* Stepper */}
        <nav className="stepper" aria-label="Learning phases">
          {STEPS.map((s, i) => {
            const done    = state.phaseStatus[s.key];
            const active  = s.key === phase;
            const canClick = done || i < currentIdx;
            let cls = 'stepper-step';
            if (active) cls += ' active';
            else if (done) cls += ' done clickable';
            else if (canClick) cls += ' clickable';
            return (
              <div key={s.key} style={{ display:'flex', alignItems:'center' }}>
                {i > 0 && <div className="stepper-sep" />}
                <button
                  className={cls}
                  onClick={() => canClick && !active && (stopNarration(), navigate(`/${s.key === 'wonder' ? 'wonder' : s.key === 'story' ? 'story' : s.key === 'simulate' ? 'simulate' : s.key === 'play' ? 'play' : 'reflect'}`))}
                  disabled={!canClick && !active}
                  aria-current={active ? 'step' : undefined}
                >
                  <span>{s.icon}</span>
                  <span>{s.num}</span>
                  <span style={{ fontWeight: active ? 900 : 700 }}>{s.label}</span>
                  {done && !active && <span style={{ color:'var(--green)' }}>✓</span>}
                </button>
              </div>
            );
          })}
        </nav>
      </div>

      {/* ── PAGE BODY ── */}
      <div className="page-body">
        {children}
      </div>

      {/* ── MUTE BUTTON — floating bottom-right ── */}
      <button
        className="mute-btn"
        onClick={handleMute}
        aria-label={state.muted ? 'Unmute narration' : 'Mute narration'}
        title={state.muted ? 'Unmute' : 'Mute'}
      >
        {state.muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}

/* Lightweight particle renderer */
function Particles() {
  // Static array — no re-renders
  const items = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    size:  2 + (i * 7) % 6,
    left:  (i * 37 + 11) % 100,
    dur:   12 + (i * 5) % 14,
    delay: (i * 3) % 11,
    op:    0.1 + (i % 5) * 0.07,
  }));
  return (
    <>
      {items.map(p => (
        <div key={p.id} className="particle" style={{
          width:  p.size, height: p.size,
          left:   `${p.left}%`, bottom: '-20px',
          animationDuration:  `${p.dur}s`,
          animationDelay:     `${p.delay}s`,
          opacity: p.op,
          zIndex: 0,
        }} />
      ))}
    </>
  );
}
