import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StepperNav from '../components/StepperNav';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';
import { narrationScripts } from '../utils/narration';

const tabs = [
  { id: 'A', icon: '🟪', name: 'Shape Builder' },
  { id: 'B', icon: '📏', name: 'Ruler Trace' },
  { id: 'C', icon: '🎚️', name: 'Side Slider' },
  { id: 'D', icon: '🔎', name: 'Missing Side' },
];

// Station A: Shape Builder
function StationA() {
  const [L, setL] = useState(8);
  const [B, setB] = useState(5);
  const P = 2 * (L + B);
  const scale = 18;
  const svgW = Math.max(200, L * scale + 80);
  const svgH = Math.max(120, B * scale + 80);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ maxWidth: '100%' }}>
        <defs>
          <pattern id="gridA" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 18 0 L 0 0 0 18" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect x="40" y="30" width={L * scale} height={B * scale} fill="url(#gridA)" stroke="#7c3aed" strokeWidth="2.5" rx="3" />
        <rect x="40" y="30" width={L * scale} height={B * scale} fill="rgba(124,58,237,0.2)" rx="3" />
        <text x={40 + (L * scale) / 2} y="22" textAnchor="middle" style={{ fontSize: '13px', fontWeight: '900', fill: '#f5b81a', fontFamily: 'Baloo 2' }}>{L} cm</text>
        <text x="26" y={30 + (B * scale) / 2 + 5} textAnchor="middle" style={{ fontSize: '13px', fontWeight: '900', fill: '#f5b81a', fontFamily: 'Baloo 2' }} transform={`rotate(-90,26,${30 + (B * scale) / 2})`}>{B} cm</text>
      </svg>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <label style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '0.8rem', color: '#f5b81a', display: 'block', marginBottom: '0.25rem' }}>Length: {L} cm</label>
          <input type="range" min="2" max="14" value={L} onChange={e => setL(Number(e.target.value))} style={{ width: '120px' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <label style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '0.8rem', color: '#22c55e', display: 'block', marginBottom: '0.25rem' }}>Breadth: {B} cm</label>
          <input type="range" min="2" max="12" value={B} onChange={e => setB(Number(e.target.value))} style={{ width: '120px' }} />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div className="formula-pill" style={{ fontSize: '1.1rem' }}>
          P = 2 × ({L} + {B}) = 2 × {L + B} = <span style={{ color: '#22c55e' }}>{P} cm</span>
        </div>
      </div>
      <div style={{ fontSize: '0.8rem', fontFamily: 'Nunito', fontWeight: 700, color: L === B ? '#22c55e' : '#f5b81a', textAlign: 'center' }}>
        {L === B ? '✅ Perfect square! All four sides are equal.' : '🔷 Rectangle — opposite sides are equal.'}
      </div>
    </div>
  );
}

// Station B: Ruler Trace
function StationB() {
  const [step, setStep] = useState(0);
  const L = 9, B = 6;
  const sides = [L, B, L, B];
  const labels = ['Top', 'Right', 'Bottom', 'Left'];
  const running = sides.slice(0, step + 1).reduce((a, v) => a + v, 0);
  const scale = 16;
  const pts = [
    [40, 30], [40 + L * scale, 30],
    [40 + L * scale, 30 + B * scale], [40, 30 + B * scale], [40, 30]
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <svg width="240" height="160" viewBox="0 0 240 160" style={{ maxWidth: '100%' }}>
        <rect x="40" y="30" width={L * scale} height={B * scale} fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2" rx="3" />
        {sides.map((_, i) => {
          if (i > step) return null;
          const from = pts[i], to = pts[i + 1];
          return <line key={i} x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]}
            stroke="#f5b81a" strokeWidth="3.5" strokeLinecap="round" />;
        })}
        <text x="120" y="22" textAnchor="middle" style={{ fontSize: '12px', fontWeight: '900', fill: step === 0 ? '#f5b81a' : 'rgba(255,255,255,0.3)', fontFamily: 'Baloo 2' }}>{L} cm</text>
        <text x="195" y="80" textAnchor="middle" style={{ fontSize: '12px', fontWeight: '900', fill: step === 1 ? '#f5b81a' : 'rgba(255,255,255,0.3)', fontFamily: 'Baloo 2' }} transform="rotate(90,195,80)">{B} cm</text>
        <text x="120" y="150" textAnchor="middle" style={{ fontSize: '12px', fontWeight: '900', fill: step === 2 ? '#f5b81a' : 'rgba(255,255,255,0.3)', fontFamily: 'Baloo 2' }}>{L} cm</text>
        <text x="28" y="80" textAnchor="middle" style={{ fontSize: '12px', fontWeight: '900', fill: step === 3 ? '#f5b81a' : 'rgba(255,255,255,0.3)', fontFamily: 'Baloo 2' }} transform="rotate(-90,28,80)">{B} cm</text>
        <text x="120" y="95" textAnchor="middle" style={{ fontSize: '14px', fontWeight: '900', fill: 'white', fontFamily: 'Baloo 2' }}>
          {step < 3 ? `Running: ${running}` : `Total: ${running} cm ✓`}
        </text>
      </svg>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {sides.map((s, i) => (
          <div key={i} style={{
            padding: '0.3rem 0.7rem', borderRadius: '9999px', fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '0.8rem',
            background: i <= step ? 'rgba(245,184,26,0.3)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${i <= step ? '#f5b81a' : 'rgba(255,255,255,0.15)'}`,
            color: i <= step ? '#f5b81a' : 'rgba(255,255,255,0.4)'
          }}>
            {labels[i]}: {s} cm
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button className="btn-secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{ opacity: step === 0 ? 0.3 : 1, fontSize: '0.85rem', padding: '0.5rem 1rem' }}>← Back</button>
        <button className="btn-gold" onClick={() => setStep(s => Math.min(3, s + 1))} disabled={step === 3} style={{ opacity: step === 3 ? 0.5 : 1, fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          {step === 3 ? '✅ Done!' : 'Next Side →'}
        </button>
        <button className="btn-secondary" onClick={() => setStep(0)} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>↺ Reset</button>
      </div>
    </div>
  );
}

// Station C: Side Slider
function StationC() {
  const [L, setL] = useState(7);
  const [B, setB] = useState(4);
  const P = 2 * (L + B);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '1.5rem', width: '100%', maxWidth: '360px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ flex: 1, minWidth: '140px' }}>
          <label style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '0.85rem', color: '#f5b81a', display: 'block', marginBottom: '0.4rem' }}>Length (L): <strong>{L} cm</strong></label>
          <input type="range" min="2" max="16" value={L} onChange={e => setL(Number(e.target.value))} />
        </div>
        <div style={{ flex: 1, minWidth: '140px' }}>
          <label style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '0.85rem', color: '#22c55e', display: 'block', marginBottom: '0.4rem' }}>Breadth (B): <strong>{B} cm</strong></label>
          <input type="range" min="2" max="12" value={B} onChange={e => setB(Number(e.target.value))} />
        </div>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '360px', padding: '1rem', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>Step-by-step calculation:</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {[
            [`L + B`, `${L} + ${B} = ${L + B}`],
            [`2 × (L + B)`, `2 × ${L + B} = ${P}`],
            [`Perimeter`, `${P} cm`],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
              <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{label}</span>
              <span style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '0.9rem', color: '#f5b81a' }}>{val}</span>
            </div>
          ))}
        </div>
        <div className="formula-pill" style={{ marginTop: '0.75rem', fontSize: '1.1rem' }}>
          P = <span style={{ color: '#22c55e' }}>{P} cm</span>
        </div>
      </div>

      <div style={{
        padding: '0.5rem 1rem', borderRadius: '9999px', fontFamily: 'Nunito', fontWeight: 800, fontSize: '0.8rem', textAlign: 'center',
        background: L === B ? 'rgba(34,197,94,0.15)' : 'rgba(245,184,26,0.1)',
        border: `1px solid ${L === B ? '#22c55e' : 'rgba(245,184,26,0.4)'}`,
        color: L === B ? '#22c55e' : '#f5b81a'
      }}>
        {L === B ? '🟢 Square — all sides equal! Use 4 × side shortcut.' : `🔷 Rectangle — P = 2 × (${L} + ${B})`}
      </div>
    </div>
  );
}

// Station D: Missing Side
function StationD() {
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState(null);
  const a = 10, b = 8, c = 3, d = 4;
  const missing = b - c; // = 5

  const check = () => {
    const val = parseInt(guess);
    if (val === missing) {
      setFeedback('correct');
      setRevealed(true);
    } else {
      setFeedback('wrong');
    }
  };

  const reset = () => { setRevealed(false); setGuess(''); setFeedback(null); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      {/* L-shape diagram */}
      <svg width="220" height="150" viewBox="0 0 220 150">
        <polygon points="20,10 150,10 150,65 90,65 90,130 20,130" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="2.5" />
        <text x="85" y="7" textAnchor="middle" style={{ fontSize: '12px', fontWeight: '900', fill: '#f5b81a', fontFamily: 'Baloo 2' }}>{a} m</text>
        <text x="158" y="40" textAnchor="start" style={{ fontSize: '12px', fontWeight: '900', fill: '#f5b81a', fontFamily: 'Baloo 2' }}>{c} m</text>
        <text x="120" y="78" textAnchor="middle" style={{ fontSize: '12px', fontWeight: '900', fill: '#f5b81a', fontFamily: 'Baloo 2' }}>{d} m</text>
        <text x="92" y="102" textAnchor="start" style={{ fontSize: '12px', fontWeight: '900', fill: revealed ? '#22c55e' : '#ef4444', fontFamily: 'Baloo 2' }}>
          {revealed ? `${missing} m ✓` : '? m'}
        </text>
        <text x="55" y="143" textAnchor="middle" style={{ fontSize: '12px', fontWeight: '900', fill: '#f5b81a', fontFamily: 'Baloo 2' }}>{a - d} m</text>
        <text x="8" y="73" textAnchor="middle" style={{ fontSize: '12px', fontWeight: '900', fill: '#f5b81a', fontFamily: 'Baloo 2' }} transform="rotate(-90,8,73)">{b} m</text>
      </svg>

      {!revealed ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>
            The left side is {b} m. The top-right notch is {c} m tall. What is the missing right side (in metres)?
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
            <input value={guess} onChange={e => setGuess(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()}
              placeholder="? m" type="number"
              style={{
                width: '80px', textAlign: 'center', padding: '0.5rem', borderRadius: '0.75rem',
                background: 'rgba(255,255,255,0.1)', border: `2px solid ${feedback === 'wrong' ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                color: 'white', fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '1.1rem', outline: 'none'
              }} />
            <button className="btn-gold" onClick={check} style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>Check!</button>
          </div>
          {feedback === 'wrong' && <p style={{ color: '#ef4444', fontFamily: 'Nunito', fontWeight: 800, fontSize: '0.8rem', marginTop: '0.3rem' }}>Not quite! Hint: missing side = {b} − {c}</p>}
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Baloo 2', fontWeight: 900, fontSize: '1rem', color: '#22c55e', marginBottom: '0.4rem' }}>✅ Correct! Missing side = {b} − {c} = {missing} m</div>
          <div className="formula-pill">Total P = {[a, c, d, missing, a - d, b].join(' + ')} = {a + c + d + missing + (a - d) + b} m</div>
          <button className="btn-secondary" onClick={reset} style={{ marginTop: '0.5rem', fontSize: '0.85rem', padding: '0.4rem 1rem' }}>↺ Try another</button>
        </div>
      )}

      <div style={{ padding: '0.4rem 0.8rem', background: 'rgba(245,184,26,0.1)', border: '1px solid rgba(245,184,26,0.3)', borderRadius: '0.75rem', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.8rem', color: '#f5b81a', textAlign: 'center' }}>
        💡 Opposite sides of an L-shape must balance: missing = full side − notch
      </div>
    </div>
  );
}

export default function SimulatePage() {
  const navigate = useNavigate();
  const { dispatch } = useGameState();
  const [activeTab, setActiveTab] = useState('A');
  const narrationKeys = { A: 'stationA', B: 'stationB', C: 'stationC', D: 'stationD' };

  const playNarration = useCallback((tabId) => {
    stopNarration();
    const key = narrationKeys[tabId];
    setTimeout(() => narrateText(narrationScripts.simulate[key], 'statement'), 400);
  }, []);

  useEffect(() => { playNarration('A'); return () => stopNarration(); }, [playNarration]);

  const handleTab = (id) => {
    setActiveTab(id);
    playNarration(id);
  };

  const handleDone = () => {
    dispatch({ type: 'COMPLETE_PHASE', phase: 'simulate' });
    navigate('/play');
  };

  return (
    <div className="app-container">
      <StepperNav currentPhase="simulate" />
      <div className="phase-content">
        <div style={{ maxWidth: '660px', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Baloo 2', fontWeight: 900, fontSize: '1.5rem', color: '#f5b81a' }}>🔬 03 — Simulate</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito', fontWeight: 600, fontSize: '0.8rem' }}>Explore and discover — no wrong answers!</p>
          </div>

          {/* Tab bar */}
          <div className="tab-bar">
            {tabs.map(t => (
              <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => handleTab(t.id)}>
                {t.icon} {t.id}: {t.name}
              </button>
            ))}
          </div>

          {/* Station content */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            {activeTab === 'A' && <StationA />}
            {activeTab === 'B' && <StationB />}
            {activeTab === 'C' && <StationC />}
            {activeTab === 'D' && <StationD />}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between' }}>
            <button className="btn-secondary" onClick={() => handleTab(tabs[Math.max(0, tabs.findIndex(t => t.id === activeTab) - 1)].id)}
              disabled={activeTab === 'A'} style={{ opacity: activeTab === 'A' ? 0.3 : 1, fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              ← Prev Station
            </button>
            {activeTab === 'D' ? (
              <button className="btn-gold" onClick={handleDone} style={{ padding: '0.7rem 1.5rem', fontSize: '0.95rem' }}>
                🎮 Go to Play!
              </button>
            ) : (
              <button className="btn-gold" onClick={() => handleTab(tabs[tabs.findIndex(t => t.id === activeTab) + 1].id)}
                style={{ padding: '0.7rem 1.5rem', fontSize: '0.95rem' }}>
                Next Station →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
