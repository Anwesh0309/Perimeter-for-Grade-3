import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';
import { worlds } from '../data/worlds';

function Stars({ n }) {
  return <div style={{ display:'flex', gap:'2px' }}>{[1,2,3].map(i=><span key={i} style={{ fontSize:'0.75rem', opacity:i<=n?1:0.2 }}>⭐</span>)}</div>;
}

export default function WorldSelectPage() {
  const navigate = useNavigate();
  const { state } = useGameState();

  useEffect(() => {
    stopNarration();
    const t = setTimeout(() => narrateText(
      'Welcome to the Play phase! Choose a world to begin your perimeter challenge. Complete each world to unlock the next one. Earn stars and experience points for every correct answer. Good luck, perimeter explorer!',
      'encouragement'
    ), 500);
    return () => { clearTimeout(t); stopNarration(); };
  }, []);

  const totalCorrect = Object.values(state.worlds).reduce((s,w)=>s+(w.correctCount||0),0);
  const totalStars   = Object.values(state.worlds).reduce((s,w)=>s+(w.starsEarned||0),0);
  const allDone      = Object.values(state.worlds).every(w=>w.attempted);

  return (
    <PageShell phase="play">
      <div style={{ maxWidth:'680px', width:'100%', display:'flex', flexDirection:'column', gap:'0.65rem' }}>

        {/* Header */}
        <div style={{ textAlign:'center' }}>
          <h2 style={{ fontFamily:'Baloo 2', fontWeight:900, fontSize:'1.4rem', color:'var(--gold)' }}>🎮 Choose Your World!</h2>
          <p style={{ fontFamily:'Nunito', fontWeight:600, fontSize:'0.78rem', color:'rgba(255,255,255,0.5)' }}>
            Answer questions in each world. Earn stars and XP!
          </p>
        </div>

        {/* Stats bar */}
        <div style={{ display:'flex', gap:'0.5rem', justifyContent:'center', flexWrap:'wrap' }}>
          {[['⭐','Stars',`${totalStars}/30`],['🔥','Streak',`${state.streak}`],['✅','Correct',`${totalCorrect}/100`],['⚡','XP',`${state.xp}`]].map(([ic,lb,vl])=>(
            <div key={lb} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'0.75rem', padding:'0.38rem 0.7rem', textAlign:'center', minWidth:'66px' }}>
              <div style={{ fontSize:'1.1rem' }}>{ic}</div>
              <div style={{ fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.82rem', color:'var(--gold)' }}>{vl}</div>
              <div style={{ fontFamily:'Nunito', fontWeight:600, fontSize:'0.6rem', color:'rgba(255,255,255,0.4)' }}>{lb}</div>
            </div>
          ))}
        </div>

        {/* World grid 5×2 */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'0.5rem' }}>
          {worlds.map(w => {
            const ws = state.worlds[w.id];
            const locked = !ws.unlocked;
            const mastered = ws.starsEarned >= 2;
            return (
              <div key={w.id}
                className={`world-card ${locked?'locked':''} ${mastered?'mastered':''}`}
                onClick={() => !locked && navigate(`/play/${w.id}`)}
                style={{ borderColor: mastered ? 'rgba(34,197,94,0.4)' : locked ? undefined : `${w.color}55` }}
              >
                {locked && (
                  <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)', borderRadius:'var(--radius-md)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1 }}>
                    <span style={{ fontSize:'1.3rem' }}>🔒</span>
                  </div>
                )}
                <span style={{ fontSize:'1.5rem' }}>{w.icon}</span>
                <span style={{ fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.68rem', color:'#fff', lineHeight:1.2 }}>{w.name}</span>
                <span style={{ fontFamily:'Nunito', fontWeight:600, fontSize:'0.58rem', color:'rgba(255,255,255,0.45)' }}>Q{(w.id-1)*10+1}–{w.id*10}</span>
                <Stars n={ws.starsEarned||0}/>
                {!locked && (
                  <div style={{
                    background: ws.attempted ? '#22c55e' : '#ec4899',
                    color:'#fff', borderRadius:'9999px',
                    padding:'0.18rem 0.55rem', fontSize:'0.62rem',
                    fontFamily:'Baloo 2', fontWeight:800,
                  }}>
                    {ws.attempted ? '↺ Retry' : '▶ PLAY'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View results if all done */}
        {allDone && (
          <button className="btn-gold" style={{ width:'100%' }} onClick={()=>navigate('/reflect')}>
            🏆 See Your Results!
          </button>
        )}
      </div>
    </PageShell>
  );
}
