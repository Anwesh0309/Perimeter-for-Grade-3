import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';

const TABS = [
  { id:'A', icon:'🟪', label:'Shape Builder' },
  { id:'B', icon:'📏', label:'Ruler Trace' },
  { id:'C', icon:'🎚️', label:'Side Slider' },
  { id:'D', icon:'🔎', label:'Spot Missing Side' },
];

const NARRATIONS = {
  A: "Welcome to the Shape Builder! Drag the sliders to resize the rectangle on the grid. Watch how the perimeter updates live as you change the length and breadth. Try making a square by setting both sides equal!",
  B: "This is the Ruler Trace station! Watch Mira walk around each side of the shape one step at a time. The running total builds up as each side is added. Can you predict the final perimeter before Mira finishes?",
  C: "Welcome to the Side Slider! Drag the sliders to change the length and breadth of the rectangle. See the perimeter formula update live with every move: 2 times open bracket length plus breadth close bracket. The step-by-step calculation is shown right below!",
  D: "Time to spot the missing side! Look at this L-shaped figure. One side length is hidden. Use the opposite-side rule to figure out the missing measurement before the full perimeter can be calculated. Can you work it out?",
};

// ── Station A: Shape Builder ──────────────────────────
function StationA({ onComplete }) {
  const [L, setL] = useState(8);
  const [B, setB] = useState(5);
  const [interacted, setInteracted] = useState(false);
  const P = 2 * (L + B);
  const isSquare = L === B;
  const sc = 16;
  const W = L * sc, H = B * sc;

  const handleChange = (setter) => (e) => {
    setter(Number(e.target.value));
    if (!interacted) { setInteracted(true); onComplete(); }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.8rem' }}>
      <h3 style={{ fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.95rem', color:'var(--gold)' }}>
        🟪 Shape Builder
      </h3>
      <p style={{ fontFamily:'Nunito', fontWeight:600, fontSize:'0.78rem', color:'rgba(255,255,255,0.55)', textAlign:'center' }}>
        Drag the sliders — watch the perimeter update live!
      </p>

      {/* SVG canvas */}
      <svg width={W+90} height={H+80} viewBox={`0 0 ${W+90} ${H+80}`} style={{ maxWidth:'100%' }}>
        <defs>
          <pattern id="gA" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect x="45" y="30" width={W} height={H} fill="url(#gA)" stroke="#7c3aed" strokeWidth="2.5" rx="3"/>
        <rect x="45" y="30" width={W} height={H} fill="rgba(124,58,237,0.2)" rx="3"/>
        <text x={45+W/2} y="20" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="14" fill="#f5b81a">{L} cm</text>
        <text x="30" y={30+H/2+5} textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="#f5b81a" transform={`rotate(-90,30,${30+H/2})`}>{B} cm</text>
        <text x={45+W/2} y={30+H+22} textAnchor="middle" fontFamily="Baloo 2" fontWeight="700" fontSize="12" fill="rgba(255,255,255,0.35)">{L} cm</text>
        <text x={45+W+18} y={30+H/2+5} textAnchor="middle" fontFamily="Baloo 2" fontWeight="700" fontSize="12" fill="rgba(255,255,255,0.35)" transform={`rotate(90,${45+W+18},${30+H/2})`}>{B} cm</text>
      </svg>

      {/* Sliders */}
      <div style={{ display:'flex', gap:'1.5rem', width:'100%', maxWidth:'380px', flexWrap:'wrap', justifyContent:'center' }}>
        {[['Length (L)', L, setL, 2, 15, '#f5b81a'], ['Breadth (B)', B, setB, 2, 12, '#22c55e']].map(([name, val, set, mn, mx, col])=>(
          <div key={name} style={{ flex:1, minWidth:'140px' }}>
            <div style={{ fontFamily:'Nunito', fontWeight:800, fontSize:'0.8rem', color:col, marginBottom:'0.3rem' }}>
              {name}: <strong>{val} cm</strong>
            </div>
            <input type="range" min={mn} max={mx} value={val} onChange={handleChange(set)}/>
          </div>
        ))}
      </div>

      {/* Live formula */}
      <div className="formula-pill" style={{ fontSize:'1rem', width:'100%', maxWidth:'360px' }}>
        P = 2 × ({L} + {B}) = 2 × {L+B} = <span style={{ color:'#22c55e', marginLeft:'0.3rem' }}>{P} cm</span>
      </div>
      <div style={{
        padding:'0.4rem 1rem', borderRadius:'9999px',
        background: isSquare ? 'rgba(34,197,94,0.12)' : 'rgba(245,184,26,0.08)',
        border:`1px solid ${isSquare ? 'rgba(34,197,94,0.4)' : 'rgba(245,184,26,0.3)'}`,
        fontFamily:'Nunito', fontWeight:800, fontSize:'0.78rem',
        color: isSquare ? 'var(--green)' : 'var(--gold)',
      }}>
        {isSquare ? '✅ Perfect square! All sides equal — can use 4 × side shortcut.' : '🔷 Rectangle — opposite sides are equal, use 2 × (L + B).'}
      </div>
    </div>
  );
}

// ── Station B: Ruler Trace ────────────────────────────
function StationB({ onComplete }) {
  const [step, setStep] = useState(-1);
  const L=10, B=6, sc=14;
  const sides = [L,B,L,B];
  const sideLabels = ['Top (L)','Right (B)','Bottom (L)','Left (B)'];
  const colors = ['#f5b81a','#22c55e','#3b82f6','#ec4899'];
  const pts = [[45,30],[45+L*sc,30],[45+L*sc,30+B*sc],[45,30+B*sc],[45,30]];
  const running = step >= 0 ? sides.slice(0,step+1).reduce((a,v)=>a+v,0) : 0;

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.8rem' }}>
      <h3 style={{ fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.95rem', color:'var(--gold)' }}>📏 Ruler Trace</h3>
      <p style={{ fontFamily:'Nunito', fontWeight:600, fontSize:'0.78rem', color:'rgba(255,255,255,0.55)', textAlign:'center' }}>
        Watch Mira trace each side — running total builds up!
      </p>
      <svg width="250" height="160" viewBox="0 0 250 160" style={{ maxWidth:'100%' }}>
        <rect x="45" y="30" width={L*sc} height={B*sc} fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="1.5" rx="2"/>
        {sides.map((_,i)=>{
          if(i>step) return null;
          const [x1,y1]=pts[i],[x2,y2]=pts[i+1];
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors[i]} strokeWidth="3.5" strokeLinecap="round"/>;
        })}
        <text x={45+L*sc/2} y="22" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill={step===0?'#f5b81a':'rgba(255,255,255,0.25)'}>{L} cm</text>
        <text x={45+L*sc+14} y={30+B*sc/2+4} textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill={step===1?'#22c55e':'rgba(255,255,255,0.25)'} transform={`rotate(90,${45+L*sc+14},${30+B*sc/2})`}>{B} cm</text>
        <text x={45+L*sc/2} y={30+B*sc+18} textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill={step===2?'#3b82f6':'rgba(255,255,255,0.25)'}>{L} cm</text>
        <text x="30" y={30+B*sc/2+4} textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill={step===3?'#ec4899':'rgba(255,255,255,0.25)'} transform={`rotate(-90,30,${30+B*sc/2})`}>{B} cm</text>
        {step>=0 && (
          <text x={45+L*sc/2} y={30+B*sc/2+6} textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="13" fill="white">
            {step===3 ? `✓ P = ${running} cm` : `Running: ${running} cm`}
          </text>
        )}
      </svg>

      {/* Side chips */}
      <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', justifyContent:'center' }}>
        {sides.map((s,i)=>(
          <div key={i} style={{
            padding:'0.28rem 0.65rem', borderRadius:'9999px',
            fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.75rem',
            background: i<=step ? `${colors[i]}22` : 'rgba(255,255,255,0.05)',
            border:`1px solid ${i<=step ? colors[i] : 'rgba(255,255,255,0.12)'}`,
            color: i<=step ? colors[i] : 'rgba(255,255,255,0.35)',
          }}>{sideLabels[i]}: {s} cm</div>
        ))}
      </div>

      <div style={{ display:'flex', gap:'0.5rem' }}>
        <button className="btn-ghost" onClick={()=>setStep(s=>Math.max(-1,s-1))} disabled={step<0} style={{ fontSize:'0.8rem', padding:'0.4rem 0.9rem' }}>← Back</button>
        <button className="btn-gold" onClick={()=>{ const next=Math.min(3,step+1); setStep(next); if(next===3) onComplete(); }} disabled={step>=3} style={{ fontSize:'0.8rem', padding:'0.4rem 0.9rem' }}>
          {step>=3 ? '✅ Done!' : step<0 ? 'Start →' : 'Next Side →'}
        </button>
        <button className="btn-ghost" onClick={()=>setStep(-1)} style={{ fontSize:'0.8rem', padding:'0.4rem 0.9rem' }}>↺</button>
      </div>
    </div>
  );
}

// ── Station C: Side Slider (matches reference exactly) ───
function StationC({ onComplete }) {
  const [L, setL] = useState(6);
  const [B, setB] = useState(3);
  const [interacted, setInteracted] = useState(false);
  const needsRegroup = B > L;
  const P = 2*(L+B);

  const handleChange = (setter) => (e) => {
    setter(Number(e.target.value));
    if (!interacted) { setInteracted(true); onComplete(); }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem', alignItems:'center' }}>
      <h3 style={{ fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.95rem', color:'var(--gold)' }}>🎚️ Place Value Slider</h3>
      <p style={{ fontFamily:'Nunito', fontWeight:600, fontSize:'0.78rem', color:'rgba(255,255,255,0.55)', textAlign:'center' }}>
        Drag the slider — watch the perimeter update live!
      </p>

      {/* Minuend / Subtrahend display — matches reference styling */}
      <div style={{ display:'flex', alignItems:'center', gap:'1.2rem', justifyContent:'center' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:'Baloo 2', fontWeight:700, fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em', textTransform:'uppercase' }}>LENGTH</div>
          <div style={{ fontFamily:'Baloo 2', fontWeight:900, fontSize:'2.2rem', color:'var(--gold)' }}>{L}</div>
        </div>
        <div style={{ fontFamily:'Baloo 2', fontWeight:900, fontSize:'2rem', color:'rgba(255,255,255,0.4)' }}>×</div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:'Baloo 2', fontWeight:700, fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em', textTransform:'uppercase' }}>BREADTH</div>
          <div style={{ fontFamily:'Baloo 2', fontWeight:900, fontSize:'2.2rem', color:'#a5b4fc' }}>{B}</div>
        </div>
      </div>

      {/* Slider */}
      <div style={{ width:'100%', maxWidth:'340px' }}>
        <div style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.78rem', color:'rgba(255,255,255,0.5)', marginBottom:'0.3rem' }}>
          Breadth digit: {B}
        </div>
        <input type="range" min={1} max={14} value={B} onChange={handleChange(setB)}/>
      </div>
      <div style={{ width:'100%', maxWidth:'340px' }}>
        <div style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.78rem', color:'rgba(255,255,255,0.5)', marginBottom:'0.3rem' }}>
          Length digit: {L}
        </div>
        <input type="range" min={1} max={18} value={L} onChange={handleChange(setL)}/>
      </div>

      {/* Calculation breakdown — reference dark box */}
      <div className="card" style={{ width:'100%', maxWidth:'340px', padding:'0.75rem 1rem' }}>
        {needsRegroup && (
          <div style={{ fontFamily:'Nunito', fontWeight:800, fontSize:'0.8rem', color:'#fbbf24', marginBottom:'0.4rem' }}>
            ⚠ B ({B}) &gt; L ({L}) — check your values!
          </div>
        )}
        <div style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.88rem', color:'rgba(255,255,255,0.7)', lineHeight:1.9 }}>
          <div>Step 1 — L + B = {L} + {B} = <strong style={{ color:'var(--gold)' }}>{L+B}</strong></div>
          <div>Step 2 — 2 × (L + B) = 2 × {L+B} = <strong style={{ color:'var(--gold)' }}>{P}</strong></div>
        </div>
        <div style={{ fontFamily:'Baloo 2', fontWeight:900, fontSize:'1.1rem', color:'var(--gold)', marginTop:'0.4rem' }}>
          P = {L} + {B} + {L} + {B} = {P} cm
        </div>
      </div>

      {/* Status banner — matches reference */}
      <div style={{
        width:'100%', maxWidth:'340px', padding:'0.45rem 1rem',
        background: !needsRegroup ? 'rgba(239,68,68,0.15)' : 'rgba(245,184,26,0.1)',
        border:`1px solid ${!needsRegroup ? 'rgba(239,68,68,0.4)' : 'rgba(245,184,26,0.3)'}`,
        borderRadius:'0.5rem', fontFamily:'Nunito', fontWeight:800, fontSize:'0.78rem',
        color: !needsRegroup ? '#fca5a5' : 'var(--gold)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <span>{!needsRegroup ? '🟢 Simple rectangle — no issues!' : '🟠 Composite shape? Add all outer sides!'}</span>
        <button onClick={()=>{ setL(Math.floor(Math.random()*14)+3); setB(Math.floor(Math.random()*10)+2); if(!interacted){setInteracted(true);onComplete();} }} style={{ background:'rgba(255,255,255,0.12)', border:'none', borderRadius:'0.4rem', color:'white', fontFamily:'Baloo 2', fontWeight:700, fontSize:'0.72rem', padding:'0.25rem 0.6rem', cursor:'pointer' }}>
          New Number
        </button>
      </div>
    </div>
  );
}

// ── Station D: Spot the Missing Side ────────────────────
function StationD({ onComplete }) {
  const [guess, setGuess] = useState('');
  const [state, setState] = useState('idle'); // idle | correct | wrong
  const [shape, setShape] = useState({a:10,b:8,c:3,d:4});
  const {a,b,c,d} = shape;
  const missing = b - c;

  const reset = () => { setGuess(''); setState('idle'); setShape({a:Math.floor(Math.random()*6)+8,b:Math.floor(Math.random()*5)+6,c:Math.floor(Math.random()*3)+2,d:Math.floor(Math.random()*4)+3}); };
  const check = () => {
    if (parseInt(guess) === missing) { setState('correct'); onComplete(); }
    else { setState('wrong'); }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.8rem' }}>
      <h3 style={{ fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.95rem', color:'var(--gold)' }}>🔎 Spot the Missing Side</h3>
      <p style={{ fontFamily:'Nunito', fontWeight:600, fontSize:'0.78rem', color:'rgba(255,255,255,0.55)', textAlign:'center' }}>
        Use the opposite-side rule to find the hidden length!
      </p>

      {/* L-shape diagram */}
      <svg width="230" height="160" viewBox="0 0 230 160">
        <polygon points={`20,10 ${20+a*12},10 ${20+a*12},${10+c*14} ${20+(a-d)*12},${10+c*14} ${20+(a-d)*12},${10+b*14} 20,${10+b*14}`}
          fill="rgba(59,130,246,0.18)" stroke="#3b82f6" strokeWidth="2.5"/>
        <text x={20+a*6} y="6" textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill="#f5b81a">{a} m</text>
        <text x={20+a*12+14} y={10+c*7+4} textAnchor="start" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill="#f5b81a">{c} m</text>
        <text x={20+(a-d/2)*12} y={10+c*14+14} textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill="#f5b81a">{d} m</text>
        <text x={20+(a-d)*12+14} y={10+c*14+b*7/2} textAnchor="start" fontFamily="Baloo 2" fontWeight="900" fontSize="12"
          fill={state==='correct' ? '#22c55e' : '#ef4444'}>{state==='correct' ? `${missing} m ✓` : '? m'}</text>
        <text x={20+a*6/2} y={10+b*14+14} textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill="#f5b81a">{a-d} m</text>
        <text x="8" y={10+b*7+4} textAnchor="middle" fontFamily="Baloo 2" fontWeight="900" fontSize="12" fill="#f5b81a" transform={`rotate(-90,8,${10+b*7})`}>{b} m</text>
      </svg>

      {state !== 'correct' ? (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem', width:'100%', maxWidth:'320px' }}>
          <p style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.82rem', color:'rgba(255,255,255,0.75)', textAlign:'center' }}>
            The full left side is <strong style={{ color:'var(--gold)' }}>{b} m</strong>. The top-right notch is <strong style={{ color:'var(--gold)' }}>{c} m</strong> tall. What is the missing right side?
          </p>
          <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
            <input className={`num-input ${state==='wrong'?'err':''}`} type="number"
              value={guess} onChange={e=>setGuess(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&check()} placeholder="? m"/>
            <button className="btn-gold" onClick={check} style={{ fontSize:'0.85rem', padding:'0.5rem 1.1rem' }}>Check!</button>
          </div>
          {state==='wrong' && <p style={{ fontFamily:'Nunito', fontWeight:800, fontSize:'0.78rem', color:'var(--red)' }}>Not quite! Hint: {b} − {c} = ?</p>}
        </div>
      ) : (
        <div style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem' }}>
          <div style={{ fontFamily:'Baloo 2', fontWeight:900, fontSize:'1rem', color:'var(--green)' }}>✅ Correct! Missing = {b} − {c} = {missing} m</div>
          <div className="formula-pill" style={{ fontSize:'0.88rem' }}>Total P = {[a,c,d,missing,a-d,b].join(' + ')} = {a+c+d+missing+(a-d)+b} m</div>
          <button className="btn-ghost" onClick={reset} style={{ marginTop:'0.25rem', fontSize:'0.8rem' }}>↺ New Shape</button>
        </div>
      )}

      <div className="hint-box" style={{ width:'100%', maxWidth:'320px' }}>
        💡 Key rule: On any L-shaped figure, opposite sides must balance.<br/>
        Missing side = longer parallel side − short notch
      </div>
    </div>
  );
}

// ── Main SimulatePage ─────────────────────────────────
const ORDER = ['A','B','C','D'];

export default function SimulatePage() {
  const navigate = useNavigate();
  const { dispatch } = useGameState();
  const [tab, setTab] = useState('A');
  const [completed, setCompleted] = useState({ A:false, B:false, C:false, D:false });
  const narrateTimerRef = useRef(null);

  const markDone = useCallback((id) => {
    setCompleted(prev => prev[id] ? prev : { ...prev, [id]: true });
  }, []);

  const playNarration = useCallback((id) => {
    // Cancel any pending narration timer
    if (narrateTimerRef.current) clearTimeout(narrateTimerRef.current);
    stopNarration();
    narrateTimerRef.current = setTimeout(() => narrateText(NARRATIONS[id], 'statement'), 400);
  }, []);

  useEffect(() => {
    playNarration('A');
    return () => {
      if (narrateTimerRef.current) clearTimeout(narrateTimerRef.current);
      stopNarration(); // prevent bleed into Play phase
    };
  }, [playNarration]);

  const handleTab = (id) => { setTab(id); playNarration(id); };
  const tabIdx = ORDER.indexOf(tab);
  const currentDone = completed[tab];

  const handleDone = () => {
    if (narrateTimerRef.current) clearTimeout(narrateTimerRef.current);
    stopNarration();
    dispatch({ type:'COMPLETE_PHASE', phase:'simulate' });
    navigate('/play');
  };

  return (
    <PageShell phase="simulate">
      <div style={{ maxWidth:'660px', width:'100%', display:'flex', flexDirection:'column', gap:'0.55rem' }}>

        {/* Header */}
        <div style={{ textAlign:'center' }}>
          <h2 style={{ fontFamily:'Baloo 2', fontWeight:900, fontSize:'1.35rem', color:'var(--gold)' }}>✏️ Simulate</h2>
          <p style={{ fontFamily:'Nunito', fontWeight:600, fontSize:'0.78rem', color:'rgba(255,255,255,0.5)' }}>
            Explore and discover — no wrong answers!
          </p>
        </div>

        {/* Tab bar */}
        <div className="tab-bar">
          {TABS.map(t => (
            <button key={t.id} className={`tab-btn ${tab===t.id?'active':''}`} onClick={()=>handleTab(t.id)}>
              {t.icon} {t.id} {t.label} {completed[t.id] ? '✓' : ''}
            </button>
          ))}
        </div>

        {/* Station card */}
        <div className="card" style={{ padding:'1rem' }}>
          {tab==='A' && <StationA onComplete={()=>markDone('A')}/>}
          {tab==='B' && <StationB onComplete={()=>markDone('B')}/>}
          {tab==='C' && <StationC onComplete={()=>markDone('C')}/>}
          {tab==='D' && <StationD onComplete={()=>markDone('D')}/>}
        </div>

        {/* Prev / Next station bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.75rem' }}>
          {/* Previous always available if not first tab */}
          <button
            className="btn-ghost"
            onClick={()=>handleTab(ORDER[tabIdx-1])}
            disabled={tabIdx===0}
            style={{ opacity:tabIdx===0?0.3:1 }}
          >
            ← Previous Station
          </button>

          {/* Right side — only show action button when station is completed */}
          {!currentDone ? (
            <div style={{
              fontFamily:'Nunito', fontWeight:700, fontSize:'0.8rem',
              color:'rgba(255,255,255,0.4)', fontStyle:'italic',
              display:'flex', alignItems:'center', gap:'0.4rem',
            }}>
              <span>🎯</span>
              <span>Complete the activity to continue</span>
            </div>
          ) : tab==='D' ? (
            <button className="btn-gold" onClick={handleDone}>🎮 Go to Play!</button>
          ) : (
            <button className="btn-gold" onClick={()=>handleTab(ORDER[tabIdx+1])}>Next Station →</button>
          )}
        </div>
      </div>
    </PageShell>
  );
}
