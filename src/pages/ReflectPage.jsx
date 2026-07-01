import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';
import { getReflectNarration } from '../utils/narration';
import { worlds } from '../data/worlds';

// ── Animated score ring ───────────────────────────────────
function ScoreRing({ pct, fraction }) {
  const [anim, setAnim] = useState(0);
  const r = 62, circ = 2 * Math.PI * r;
  const offset = circ - (anim / 100) * circ;
  const col = pct>=90 ? '#22c55e' : pct>=70 ? '#f5b81a' : pct>=50 ? '#3b82f6' : '#ef4444';
  useEffect(() => {
    const t = setTimeout(() => setAnim(pct), 400);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div style={{ position:'relative', display:'inline-flex', alignItems:'center', justifyContent:'center', width:150, height:150 }}>
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="11"/>
        <circle cx="75" cy="75" r={r} fill="none" stroke={col} strokeWidth="11"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 75 75)" style={{ transition:'stroke-dashoffset 1.3s ease' }}/>
      </svg>
      <div style={{ position:'absolute', textAlign:'center' }}>
        <div style={{ fontFamily:'Baloo 2', fontWeight:900, fontSize:'1.9rem', color:col, lineHeight:1 }}>{pct}%</div>
        <div style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.75rem', color:'rgba(255,255,255,0.5)' }}>{fraction}</div>
      </div>
    </div>
  );
}

// ── Confetti burst ────────────────────────────────────────
function Confetti({ go }) {
  const COLS = ['#f5b81a','#22c55e','#ec4899','#3b82f6','#a855f7','#ef4444','#ffcc33'];
  const [pieces, setPieces] = useState([]);
  useEffect(() => {
    if (!go) return;
    setPieces(Array.from({ length:55 }, (_,i) => ({
      id:i, color:COLS[i%COLS.length],
      left:Math.random()*100, delay:Math.random()*1.4,
      dur:Math.random()*1.8+2.2, size:Math.random()*8+5, round:Math.random()>0.5,
    })));
    const t = setTimeout(() => setPieces([]), 4500);
    return () => clearTimeout(t);
  }, [go]);
  return (
    <>
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left:`${p.left}%`, top:'-10px',
          background:p.color, width:p.size, height:p.size,
          borderRadius:p.round ? '50%' : '2px',
          animationDelay:`${p.delay}s`, animationDuration:`${p.dur}s`,
        }}/>
      ))}
    </>
  );
}

// ── ReflectPage ───────────────────────────────────────────
export default function ReflectPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useGameState();
  const timerRef = useRef(null);

  const totalCorrect   = Object.values(state.worlds).reduce((s,w) => s + (w.correctCount||0), 0);
  const pct            = Math.round((totalCorrect / 100) * 100);
  const worldsMastered = Object.values(state.worlds).filter(w => w.starsEarned >= 2).length;

  useEffect(() => {
    stopNarration();
    dispatch({ type:'COMPLETE_PHASE', phase:'reflect' });
    const text = getReflectNarration(pct);
    timerRef.current = setTimeout(() =>
      narrateText(text, pct >= 70 ? 'celebration' : 'encouragement'), 800
    );
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      stopNarration();
    };
  }, []);

  const mascotMsg = pct >= 90
    ? "Perimeter Pro! You measured everything perfectly! 🏆"
    : pct >= 70 ? "Brilliant work! You are a fantastic shape measurer! 📐"
    : pct >= 50 ? "Great effort! Keep practising to master every world! 💪"
    : "Well done for finishing! Try again to boost your score! 🐭";

  const stars = pct>=90 ? 3 : pct>=70 ? 2 : pct>=50 ? 1 : 0;

  const handlePlayAgain = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    stopNarration();
    dispatch({ type:'PLAY_AGAIN' });
    navigate('/');
  };

  const handleHome = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    stopNarration();
    navigate('/');
  };

  return (
    <PageShell phase="reflect">
      <Confetti go={pct >= 50}/>
      <div style={{ maxWidth:'620px', width:'100%', display:'flex', flexDirection:'column', gap:'0.6rem' }}>

        {/* Header */}
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:'2.5rem' }}>🏆</div>
          <h2 style={{ fontFamily:'Baloo 2', fontWeight:900, fontSize:'1.7rem',
            color:'var(--gold)', lineHeight:1.1 }}>Journey Complete!</h2>
          <p style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.82rem',
            color:'rgba(255,255,255,0.55)' }}>You finished all 5 phases!</p>
        </div>

        {/* Score ring + stat chips */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
          gap:'1.5rem', flexWrap:'wrap' }}>
          <ScoreRing pct={pct} fraction={`${totalCorrect}/100`}/>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.45rem' }}>
            {[['⚡','XP Earned',`${state.xp} XP`],['🔥','Max Streak',`${state.maxStreak}`],
              ['🌍','Worlds Mastered',`${worldsMastered}/10`]].map(([ic,lb,vl]) => (
              <div key={lb} style={{
                background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.11)',
                borderRadius:'0.75rem', padding:'0.38rem 0.75rem',
                display:'flex', alignItems:'center', gap:'0.45rem', minWidth:'155px',
              }}>
                <span style={{ fontSize:'1.1rem' }}>{ic}</span>
                <div>
                  <div style={{ fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.88rem', color:'var(--gold)' }}>{vl}</div>
                  <div style={{ fontFamily:'Nunito', fontWeight:600, fontSize:'0.6rem', color:'rgba(255,255,255,0.45)' }}>{lb}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stars */}
        <div style={{ display:'flex', gap:'0.6rem', justifyContent:'center' }}>
          {[1,2,3].map(i => (
            <span key={i} style={{
              fontSize:'1.8rem', opacity: i<=stars ? 1 : 0.18,
              transition:'opacity 0.5s', transitionDelay:`${i*0.2}s`,
            }}>⭐</span>
          ))}
        </div>

        {/* Per-world results */}
        <div className="card" style={{ padding:'0.75rem' }}>
          <h3 style={{ fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.9rem',
            color:'var(--gold)', marginBottom:'0.45rem', textAlign:'center' }}>
            World Results
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.32rem' }}>
            {worlds.map(w => {
              const ws   = state.worlds[w.id];
              const c    = ws?.correctCount || 0;
              const st   = ws?.starsEarned  || 0;
              const done = ws?.attempted;
              return (
                <div key={w.id} style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  background:'rgba(255,255,255,0.04)', borderRadius:'0.45rem',
                  padding:'0.3rem 0.55rem',
                  border:`1px solid ${done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
                    <span style={{ fontSize:'0.9rem' }}>{w.icon}</span>
                    <span style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.67rem',
                      color:'rgba(255,255,255,0.75)' }}>{w.name}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
                    <span style={{ fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.72rem', color:'var(--green)' }}>
                      {c}/10
                    </span>
                    <div style={{ display:'flex', gap:'1px' }}>
                      {[1,2,3].map(i => (
                        <span key={i} style={{ fontSize:'0.7rem', opacity: i<=st ? 1 : 0.18 }}>⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mascot */}
        <div style={{ display:'flex', alignItems:'flex-start', gap:'0.55rem' }}>
          <div style={{
            width:42, height:42, borderRadius:'50%', flexShrink:0,
            background:'linear-gradient(135deg,#f5b81a,#ffcc33)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'1.3rem', boxShadow:'0 3px 10px rgba(245,184,26,0.45)',
          }}>🐭</div>
          <div style={{
            background:'#fff', color:'#1a1245',
            borderRadius:'0.75rem', borderBottomLeftRadius:'0.2rem',
            padding:'0.45rem 0.8rem',
            fontFamily:'Nunito', fontWeight:800, fontSize:'0.82rem',
            boxShadow:'0 2px 8px rgba(0,0,0,0.15)',
          }}>{mascotMsg}</div>
        </div>

        {/* Action buttons */}
        <div style={{ display:'flex', gap:'0.65rem' }}>
          <button className="btn-gold" style={{ flex:1, padding:'0.78rem' }} onClick={handlePlayAgain}>
            🔄 Play Again
          </button>
          <button className="btn-ghost" style={{ flex:1, padding:'0.78rem' }} onClick={handleHome}>
            🏠 Home
          </button>
        </div>
      </div>
    </PageShell>
  );
}
