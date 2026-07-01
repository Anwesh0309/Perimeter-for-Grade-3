import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageShell from '../components/PageShell';
import ShapeDiagram from '../components/ShapeDiagram';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';
import { generateWorldSet } from '../engine/questionEngine';
import { worlds } from '../data/worlds';

// ── 1-second auto-dismiss popup ──────────────────────────
function FeedbackPopup({ result, correctAns }) {
  return (
    <div className="popup-overlay">
      <div className={`popup-card ${result==='correct'?'ok':'bad'}`}>
        <div style={{ fontSize:'2.8rem', marginBottom:'0.4rem' }}>{result==='correct'?'🎉':'💪'}</div>
        <div style={{ fontFamily:'Baloo 2', fontWeight:900, fontSize:'1.35rem', color:'#fff' }}>
          {result==='correct' ? 'Correct!' : 'Not quite!'}
        </div>
        {result!=='correct' && (
          <div style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.88rem', color:'rgba(255,255,255,0.8)', marginTop:'0.35rem' }}>
            Answer: <strong style={{ color:'#86efac' }}>{correctAns}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

// ── World Complete modal ──────────────────────────────────
function WorldCompleteModal({ worldName, correct, onContinue }) {
  const stars = correct>=9?3:correct>=7?2:correct>=5?1:0;
  return (
    <div className="popup-overlay">
      <div style={{
        background:'linear-gradient(135deg,#1e1b4b,#312e81)',
        border:'3px solid var(--gold)', borderRadius:'1.5rem',
        padding:'2rem', textAlign:'center', maxWidth:'320px', width:'90%',
        animation:'pop-in 0.3s ease',
      }}>
        <div style={{ fontSize:'3rem', marginBottom:'0.4rem' }}>🏆</div>
        <h3 style={{ fontFamily:'Baloo 2', fontWeight:900, fontSize:'1.4rem', color:'var(--gold)' }}>World Complete!</h3>
        <p style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.85rem', color:'rgba(255,255,255,0.75)', margin:'0.4rem 0' }}>{worldName}</p>
        <div style={{ display:'flex', gap:'0.5rem', justifyContent:'center', margin:'0.7rem 0' }}>
          {[1,2,3].map(i=><span key={i} style={{ fontSize:'1.7rem', opacity:i<=stars?1:0.2 }}>⭐</span>)}
        </div>
        <p style={{ fontFamily:'Baloo 2', fontWeight:800, fontSize:'1rem', color:'var(--green)' }}>{correct}/10 Correct</p>
        <button className="btn-gold" onClick={onContinue} style={{ marginTop:'1rem', width:'100%' }}>Continue →</button>
      </div>
    </div>
  );
}

export default function QuizRunnerPage() {
  const { worldId } = useParams();
  const navigate    = useNavigate();
  const { state, dispatch } = useGameState();
  const wId   = parseInt(worldId);
  const world = worlds.find(w=>w.id===wId);

  const [questions,    setQuestions]    = useState([]);
  const [qIdx,         setQIdx]         = useState(0);
  const [selected,     setSelected]     = useState(null);
  const [showHint,     setShowHint]     = useState(false);
  const [popup,        setPopup]        = useState(null); // 'correct'|'incorrect'
  const [worldDone,    setWorldDone]    = useState(false);
  const [localCorrect, setLocalCorrect] = useState(0);
  const timerRef = useRef(null);

  // Generate questions once on mount
  useEffect(() => {
    stopNarration();
    dispatch({ type:'RESET_WORLD', worldId: wId });
    const qs = generateWorldSet(wId);
    setQuestions(qs);
    setQIdx(0); setSelected(null); setShowHint(false); setLocalCorrect(0);
    return () => { stopNarration(); if(timerRef.current) clearTimeout(timerRef.current); };
  }, [wId]);

  // Narrate question when idx changes (only if questions loaded)
  useEffect(() => {
    if (!questions.length) return;
    const q = questions[qIdx];
    if (!q) return;
    stopNarration();
    const t = setTimeout(() => narrateText(q.prompt, 'question'), 300);
    return () => clearTimeout(t);
  }, [qIdx, questions]);

  const handleAnswer = (option) => {
    if (selected !== null) return;
    const q = questions[qIdx];
    const ok = option === q.correct;
    setSelected(option);
    setPopup(ok ? 'correct' : 'incorrect');
    stopNarration();

    if (ok) setLocalCorrect(c=>c+1);
    const xpEarned = ok ? (showHint ? 0 : (state.streak >= 3 ? 9 : state.streak >= 2 ? 6 : 3)) : 0;
    dispatch({ type:'SUBMIT_ANSWER', worldId:wId, correct:ok, xpEarned });

    // Narrate feedback
    setTimeout(() => narrateText(
      ok ? 'Excellent! That is exactly right! Well done!' : 'Not quite, but keep going — you are doing great!',
      ok ? 'celebration' : 'encouragement'
    ), 150);

    // Auto-advance after 1 second
    timerRef.current = setTimeout(() => {
      setPopup(null);
      if (qIdx < questions.length - 1) {
        setQIdx(i=>i+1);
        setSelected(null);
        setShowHint(false);
      } else {
        stopNarration();
        dispatch({ type:'COMPLETE_WORLD', worldId:wId });
        setWorldDone(true);
        setTimeout(() => narrateText('World complete! Amazing work! Check your stars!', 'celebration'), 200);
      }
    }, 1000);
  };

  const handleHint = () => {
    setShowHint(true);
    const q = questions[qIdx];
    if (q) { stopNarration(); setTimeout(()=>narrateText(q.hint, 'thinking'), 200); }
  };

  if (!questions.length) {
    return (
      <PageShell phase="play">
        <div style={{ color:'#fff', fontFamily:'Baloo 2', fontSize:'1.1rem' }}>Loading questions…</div>
      </PageShell>
    );
  }

  const q    = questions[qIdx];
  const pct  = Math.round(((qIdx+1)/questions.length)*100);
  const ws   = state.worlds[wId];

  return (
    <PageShell phase="play">
      {popup && <FeedbackPopup result={popup} correctAns={q.correct}/>}
      {worldDone && <WorldCompleteModal worldName={world?.name||''} correct={localCorrect} onContinue={()=>{setWorldDone(false);navigate('/play');}}/>}

      <div style={{ maxWidth:'620px', width:'100%', display:'flex', flexDirection:'column', gap:'0.5rem' }}>

        {/* World pill + stats */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.4rem' }}>
          <div style={{ background:'rgba(255,255,255,0.09)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'9999px', padding:'0.28rem 0.75rem', fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.8rem' }}>
            {world?.icon} {world?.name}
          </div>
          <div style={{ display:'flex', gap:'0.4rem' }}>
            {[['⭐',ws?.starsEarned||0],['🔥',state.streak],['✅',`${localCorrect}/${questions.length}`]].map(([ic,vl])=>(
              <div key={ic} style={{ background:'rgba(255,255,255,0.06)', borderRadius:'0.5rem', padding:'0.22rem 0.45rem', fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.78rem', color:'var(--gold)', display:'flex', gap:'0.2rem', alignItems:'center' }}>
                {ic} {vl}
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.22rem' }}>
            <span style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.72rem', color:'rgba(255,255,255,0.45)' }}>Q {qIdx+1}/{questions.length}</span>
            <span style={{ fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.72rem', color:'var(--gold)' }}>{pct}%</span>
          </div>
          <div className="prog-track"><div className="prog-fill" style={{ width:`${pct}%` }}/></div>
        </div>

        {/* Question card */}
        <div className="card" style={{ padding:'0.9rem', display:'flex', flexDirection:'column', gap:'0.6rem' }}>

          {/* Diagram */}
          <div style={{ display:'flex', justifyContent:'center', background:'rgba(255,255,255,0.03)', borderRadius:'0.65rem', padding:'0.5rem' }}>
            <ShapeDiagram type={q.diagramType} data={q.diagramData} size={175}/>
          </div>

          {/* Question text */}
          <p style={{ fontFamily:'Nunito', fontWeight:800, fontSize:'0.92rem', color:'#fff', textAlign:'center', lineHeight:1.55 }}>
            {q.prompt}
          </p>

          {/* Answer grid 2×2 */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.45rem' }}>
            {q.options.map((opt,i) => {
              let cls = 'ans-btn';
              if (selected !== null) {
                if (opt===q.correct) cls += ' correct';
                else if (opt===selected) cls += ' wrong';
              }
              return (
                <button key={i} className={cls}
                  onClick={() => handleAnswer(opt)}
                  disabled={selected !== null}
                  style={{ opacity: selected!==null && opt!==q.correct && opt!==selected ? 0.4 : 1 }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Hint */}
          {!showHint ? (
            <button onClick={handleHint} style={{
              background:'none', border:'1px dashed rgba(245,184,26,0.35)',
              borderRadius:'0.65rem', color:'rgba(245,184,26,0.65)',
              fontFamily:'Nunito', fontWeight:700, fontSize:'0.78rem',
              padding:'0.38rem 0.75rem', cursor:'pointer', width:'100%', transition:'all 0.2s',
            }}>
              💡 Show Hint (uses XP bonus)
            </button>
          ) : (
            <div className="hint-box">💡 {q.hint}</div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
