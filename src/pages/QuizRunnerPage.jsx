import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageShell from '../components/PageShell';
import ShapeDiagram from '../components/ShapeDiagram';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';
import { generateWorldSet } from '../engine/questionEngine';
import { worlds } from '../data/worlds';

// ─────────────────────────────────────────────────────────
// Build a step-by-step explanation string from question data
// ─────────────────────────────────────────────────────────
function buildExplanation(q) {
  const { diagramType, diagramData, correct, params } = q;
  const p = params || {};

  if (diagramType === 'rectangle' || diagramType === 'grid') {
    const L = p.L ?? diagramData?.L;
    const B = p.B ?? diagramData?.B;
    if (L && B) return `L + B = ${L} + ${B} = ${L+B},  then 2 × ${L+B} = ${correct}`;
  }
  if (diagramType === 'square') {
    const s = p.side ?? diagramData?.side ?? diagramData?.L;
    if (s) return `4 × side = 4 × ${s} = ${correct}`;
  }
  if (diagramType === 'polygon') {
    const s  = p.side ?? diagramData?.sideLen;
    const ns = p.n   ?? diagramData?.sides;
    if (s && ns) return `${ns} equal sides × ${s} = ${correct}`;
  }
  if (diagramType === 'composite') {
    const a = p.a ?? diagramData?.a;
    const b = p.b ?? diagramData?.b;
    if (a && b) return `Add all 6 outer sides of the L-shape (full width ${a} m, full height ${b} m) = ${correct}`;
  }
  if (p.perimeter && p.L) return `B = P÷2 − L = ${p.perimeter}÷2 − ${p.L} = ${correct}`;
  if (p.perimeter && p.B) return `L = P÷2 − B = ${p.perimeter}÷2 − ${p.B} = ${correct}`;
  return `${q.hint}`;
}

// Formula label per shape
const FORMULA = {
  rectangle: 'P = 2 × (L + B)',
  square:    'P = 4 × side',
  grid:      'P = 2 × (L + B)',
  polygon:   'P = n × side',
  composite: 'Add all outer sides',
};

// ─────────────────────────────────────────────────────────
// Shrinking timer bar (visual countdown inside popup)
// ─────────────────────────────────────────────────────────
function TimerBar({ ms }) {
  const [w, setW] = useState(100);
  useEffect(() => {
    const t0 = Date.now();
    const id = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - t0) / ms) * 100);
      setW(pct);
      if (pct === 0) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [ms]);
  return (
    <div style={{ marginTop:'0.7rem', width:'100%', height:'4px',
      background:'rgba(255,255,255,0.15)', borderRadius:'9999px', overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${w}%`,
        background:'rgba(255,255,255,0.55)', borderRadius:'9999px',
        transition:'width 0.03s linear' }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Feedback Popup — shown for 2.5 s, then auto-dismissed
// ─────────────────────────────────────────────────────────
function FeedbackPopup({ isOk, correctAns, explanation, shapeType }) {
  const formula = FORMULA[shapeType] || 'P = sum of all sides';
  return (
    <div className="popup-overlay">
      <div
        className={`popup-card ${isOk ? 'ok' : 'bad'}`}
        style={{ maxWidth:360, width:'92%', padding:'1.4rem 1.6rem', textAlign:'center' }}
      >
        {/* Emoji + title */}
        <div style={{ fontSize:'2.4rem', marginBottom:'0.25rem' }}>{isOk ? '🎉' : '💪'}</div>
        <div style={{ fontFamily:'Baloo 2', fontWeight:900, fontSize:'1.25rem',
          color:'#fff', marginBottom:'0.55rem' }}>
          {isOk ? 'Correct! Well done!' : 'Not quite — keep going!'}
        </div>

        {/* Answer row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.45rem',
          background:'rgba(255,255,255,0.1)', borderRadius:'0.65rem',
          padding:'0.4rem 0.8rem', marginBottom:'0.55rem' }}>
          <span style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.8rem',
            color:'rgba(255,255,255,0.6)' }}>
            {isOk ? '✅ Your answer:' : '✅ Correct answer:'}
          </span>
          <span style={{ fontFamily:'Baloo 2', fontWeight:900, fontSize:'1.1rem', color:'#86efac' }}>
            {correctAns}
          </span>
        </div>

        {/* Explanation box */}
        <div style={{ background:'rgba(0,0,0,0.28)', borderRadius:'0.65rem',
          padding:'0.55rem 0.75rem', textAlign:'left' }}>
          {/* Formula pill */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem',
            background:'rgba(245,184,26,0.18)', border:'1px solid rgba(245,184,26,0.45)',
            borderRadius:'9999px', padding:'0.16rem 0.6rem',
            fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.7rem',
            color:'#f5b81a', marginBottom:'0.3rem' }}>
            📐 {formula}
          </div>
          {/* Step-by-step working */}
          <p style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.82rem',
            color:'rgba(255,255,255,0.88)', lineHeight:1.55, margin:0 }}>
            {explanation}
          </p>
        </div>

        {/* Auto-advance timer bar */}
        <TimerBar ms={2500} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// World Complete modal
// ─────────────────────────────────────────────────────────
function WorldCompleteModal({ worldName, correct, onContinue }) {
  const stars = correct >= 9 ? 3 : correct >= 7 ? 2 : correct >= 5 ? 1 : 0;
  return (
    <div className="popup-overlay">
      <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81)',
        border:'3px solid var(--gold)', borderRadius:'1.5rem',
        padding:'2rem', textAlign:'center', maxWidth:'320px', width:'90%',
        animation:'pop-in 0.3s ease' }}>
        <div style={{ fontSize:'3rem', marginBottom:'0.4rem' }}>🏆</div>
        <h3 style={{ fontFamily:'Baloo 2', fontWeight:900, fontSize:'1.4rem', color:'var(--gold)' }}>
          World Complete!
        </h3>
        <p style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.85rem',
          color:'rgba(255,255,255,0.75)', margin:'0.4rem 0' }}>{worldName}</p>
        <div style={{ display:'flex', gap:'0.5rem', justifyContent:'center', margin:'0.7rem 0' }}>
          {[1,2,3].map(i =>
            <span key={i} style={{ fontSize:'1.7rem', opacity: i <= stars ? 1 : 0.2 }}>⭐</span>
          )}
        </div>
        <p style={{ fontFamily:'Baloo 2', fontWeight:800, fontSize:'1rem', color:'var(--green)' }}>
          {correct}/10 Correct
        </p>
        <button className="btn-gold" onClick={onContinue}
          style={{ marginTop:'1rem', width:'100%' }}>
          Continue →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main QuizRunnerPage
// ─────────────────────────────────────────────────────────
export default function QuizRunnerPage() {
  const { worldId } = useParams();
  const navigate    = useNavigate();
  const { state, dispatch } = useGameState();
  const wId  = parseInt(worldId);
  const world = worlds.find(w => w.id === wId);

  const [questions,    setQuestions]    = useState([]);
  const [qIdx,         setQIdx]         = useState(0);
  const [selected,     setSelected]     = useState(null);
  const [showHint,     setShowHint]     = useState(false);
  // popupData: null | { isOk, correctAns, explanation, shapeType }
  const [popupData,    setPopupData]    = useState(null);
  const [worldDone,    setWorldDone]    = useState(false);
  const [localCorrect, setLocalCorrect] = useState(0);
  const timerRef = useRef(null);

  // ── Generate questions on world enter ──────────────────
  useEffect(() => {
    stopNarration();
    dispatch({ type: 'RESET_WORLD', worldId: wId });
    const qs = generateWorldSet(wId);
    setQuestions(qs);
    setQIdx(0);
    setSelected(null);
    setShowHint(false);
    setLocalCorrect(0);
    setPopupData(null);
    setWorldDone(false);
    return () => {
      stopNarration();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [wId]);

  // ── Narrate question text only (no bleed from other phases) ──
  useEffect(() => {
    if (!questions.length) return;
    const q = questions[qIdx];
    if (!q) return;
    // Stop everything before narrating this question
    stopNarration();
    const t = setTimeout(() => narrateText(q.prompt, 'question'), 350);
    return () => {
      clearTimeout(t);
      stopNarration(); // stop this question's audio when qIdx changes
    };
  }, [qIdx, questions]);

  // ── Answer handler ──────────────────────────────────────
  const handleAnswer = (option) => {
    if (selected !== null) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const q   = questions[qIdx];
    const isOk = option === q.correct;

    setSelected(option);

    // Stop question narration immediately
    stopNarration();

    // Build popup data
    const explanation = buildExplanation(q);
    setPopupData({ isOk, correctAns: q.correct, explanation, shapeType: q.diagramType });

    // Update game state
    if (isOk) setLocalCorrect(c => c + 1);
    const xpEarned = isOk ? (showHint ? 0 : state.streak >= 3 ? 9 : state.streak >= 2 ? 6 : 3) : 0;
    dispatch({ type: 'SUBMIT_ANSWER', worldId: wId, correct: isOk, xpEarned });

    // Narrate feedback (only this feedback — nothing else)
    setTimeout(() => narrateText(
      isOk
        ? 'Excellent! That is exactly right! Well done!'
        : 'Not quite — but keep going, you are doing great!',
      isOk ? 'celebration' : 'encouragement'
    ), 200);

    // Auto-advance after 2.5 s (matches TimerBar)
    timerRef.current = setTimeout(() => {
      // Stop feedback narration before moving on
      stopNarration();
      setPopupData(null);

      if (qIdx < questions.length - 1) {
        setQIdx(i => i + 1);
        setSelected(null);
        setShowHint(false);
      } else {
        dispatch({ type: 'COMPLETE_WORLD', worldId: wId });
        setWorldDone(true);
        setTimeout(() =>
          narrateText('World complete! Amazing work! Check your stars!', 'celebration'), 300
        );
      }
    }, 2500);
  };

  // ── Hint handler ────────────────────────────────────────
  const handleHint = () => {
    setShowHint(true);
    const q = questions[qIdx];
    if (q) {
      stopNarration();
      setTimeout(() => narrateText(q.hint, 'thinking'), 200);
    }
  };

  // ── Loading state ───────────────────────────────────────
  if (!questions.length) {
    return (
      <PageShell phase="play">
        <div style={{ color: '#fff', fontFamily: 'Baloo 2', fontSize: '1.1rem' }}>
          Loading questions…
        </div>
      </PageShell>
    );
  }

  const q   = questions[qIdx];
  const pct = Math.round(((qIdx + 1) / questions.length) * 100);
  const ws  = state.worlds[wId];

  return (
    <PageShell phase="play">
      {/* Feedback popup */}
      {popupData && (
        <FeedbackPopup
          isOk={popupData.isOk}
          correctAns={popupData.correctAns}
          explanation={popupData.explanation}
          shapeType={popupData.shapeType}
        />
      )}

      {/* World complete modal */}
      {worldDone && (
        <WorldCompleteModal
          worldName={world?.name || ''}
          correct={localCorrect}
          onContinue={() => { setWorldDone(false); navigate('/play'); }}
        />
      )}

      <div style={{ maxWidth:'620px', width:'100%', display:'flex', flexDirection:'column', gap:'0.5rem' }}>

        {/* World pill + stats bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          flexWrap:'wrap', gap:'0.4rem' }}>
          <div style={{ background:'rgba(255,255,255,0.09)',
            border:'1px solid rgba(255,255,255,0.18)', borderRadius:'9999px',
            padding:'0.28rem 0.75rem', fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.8rem' }}>
            {world?.icon} {world?.name}
          </div>
          <div style={{ display:'flex', gap:'0.4rem' }}>
            {[['⭐', ws?.starsEarned || 0], ['🔥', state.streak],
              ['✅', `${localCorrect}/${questions.length}`]].map(([ic, vl]) => (
              <div key={ic} style={{ background:'rgba(255,255,255,0.06)', borderRadius:'0.5rem',
                padding:'0.22rem 0.45rem', fontFamily:'Baloo 2', fontWeight:800,
                fontSize:'0.78rem', color:'var(--gold)',
                display:'flex', gap:'0.2rem', alignItems:'center' }}>
                {ic} {vl}
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.22rem' }}>
            <span style={{ fontFamily:'Nunito', fontWeight:700, fontSize:'0.72rem',
              color:'rgba(255,255,255,0.45)' }}>
              Q {qIdx + 1}/{questions.length}
            </span>
            <span style={{ fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.72rem',
              color:'var(--gold)' }}>{pct}%</span>
          </div>
          <div className="prog-track">
            <div className="prog-fill" style={{ width:`${pct}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div className="card" style={{ padding:'0.9rem', display:'flex',
          flexDirection:'column', gap:'0.6rem' }}>

          {/* Shape diagram */}
          <div style={{ display:'flex', justifyContent:'center',
            background:'rgba(255,255,255,0.03)', borderRadius:'0.65rem', padding:'0.5rem' }}>
            <ShapeDiagram type={q.diagramType} data={q.diagramData} size={175} />
          </div>

          {/* Question text */}
          <p style={{ fontFamily:'Nunito', fontWeight:800, fontSize:'0.92rem',
            color:'#fff', textAlign:'center', lineHeight:1.55 }}>
            {q.prompt}
          </p>

          {/* Answer buttons 2×2 */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.45rem' }}>
            {q.options.map((opt, i) => {
              let cls = 'ans-btn';
              if (selected !== null) {
                if (opt === q.correct)          cls += ' correct';
                else if (opt === selected)      cls += ' wrong';
              }
              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => handleAnswer(opt)}
                  disabled={selected !== null}
                  style={{
                    opacity: selected !== null && opt !== q.correct && opt !== selected
                      ? 0.38 : 1,
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Hint toggle */}
          {!showHint ? (
            <button onClick={handleHint} style={{
              background:'none', border:'1px dashed rgba(245,184,26,0.35)',
              borderRadius:'0.65rem', color:'rgba(245,184,26,0.65)',
              fontFamily:'Nunito', fontWeight:700, fontSize:'0.78rem',
              padding:'0.38rem 0.75rem', cursor:'pointer', width:'100%',
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
