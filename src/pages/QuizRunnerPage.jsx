import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StepperNav from '../components/StepperNav';
import ShapeDiagram from '../components/ShapeDiagram';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';
import { generateWorldSet } from '../engine/questionEngine';
import { worlds } from '../data/worlds';

function AnswerPopup({ result, correctAnswer }) {
  return (
    <div className="popup-overlay">
      <div className={`popup-card ${result === 'correct' ? 'correct-popup' : 'incorrect-popup'}`}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
          {result === 'correct' ? '🎉' : '💪'}
        </div>
        <div style={{ fontFamily: 'Baloo 2', fontWeight: 900, fontSize: '1.4rem', color: 'white' }}>
          {result === 'correct' ? 'Correct!' : 'Not quite!'}
        </div>
        {result !== 'correct' && (
          <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.4rem' }}>
            Answer: <strong style={{ color: '#22c55e' }}>{correctAnswer}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

function WorldComplete({ worldName, correct, onContinue }) {
  return (
    <div className="popup-overlay">
      <div style={{
        background: 'linear-gradient(135deg,#1e1b4b,#312e81)', border: '3px solid #f5b81a',
        borderRadius: '1.5rem', padding: '2rem', textAlign: 'center', maxWidth: '340px', width: '90%'
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆</div>
        <h3 style={{ fontFamily: 'Baloo 2', fontWeight: 900, fontSize: '1.5rem', color: '#f5b81a' }}>World Complete!</h3>
        <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', margin: '0.5rem 0' }}>{worldName}</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '0.75rem 0' }}>
          {[1, 2, 3].map(i => <span key={i} style={{ fontSize: '1.8rem', opacity: i <= (correct >= 9 ? 3 : correct >= 7 ? 2 : correct >= 5 ? 1 : 0) ? 1 : 0.25 }}>⭐</span>)}
        </div>
        <p style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '1.1rem', color: '#22c55e' }}>{correct}/10 Correct</p>
        <button className="btn-gold" onClick={onContinue} style={{ marginTop: '1rem', width: '100%' }}>Continue →</button>
      </div>
    </div>
  );
}

export default function QuizRunnerPage() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useGameState();
  const wId = parseInt(worldId);
  const world = worlds.find(w => w.id === wId);

  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [popup, setPopup] = useState(null); // 'correct' | 'incorrect'
  const [worldComplete, setWorldComplete] = useState(false);
  const [localCorrect, setLocalCorrect] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    dispatch({ type: 'RESET_WORLD', worldId: wId });
    const qs = generateWorldSet(wId);
    setQuestions(qs);
    setQIndex(0);
    setSelected(null);
    setShowHint(false);
    setLocalCorrect(0);
  }, [wId]);

  useEffect(() => {
    if (questions.length === 0) return;
    const q = questions[qIndex];
    if (q) {
      stopNarration();
      setTimeout(() => narrateText(q.prompt, 'question'), 400);
    }
    return () => stopNarration();
  }, [qIndex, questions]);

  const handleAnswer = (option) => {
    if (selected !== null) return;
    const q = questions[qIndex];
    const isCorrect = option === q.correct;
    setSelected(option);
    setPopup(isCorrect ? 'correct' : 'incorrect');
    stopNarration();

    const xpEarned = isCorrect ? (showHint ? 0 : 3) : 0;
    if (isCorrect) setLocalCorrect(c => c + 1);

    dispatch({ type: 'SUBMIT_ANSWER', worldId: wId, correct: isCorrect, xpEarned });

    narrateText(isCorrect ? 'Excellent! That is exactly right! Well done!' : 'Not quite, but keep going — you are learning!',
      isCorrect ? 'celebration' : 'encouragement');

    timerRef.current = setTimeout(() => {
      setPopup(null);
      if (qIndex < questions.length - 1) {
        setQIndex(i => i + 1);
        setSelected(null);
        setShowHint(false);
      } else {
        dispatch({ type: 'COMPLETE_WORLD', worldId: wId });
        setWorldComplete(true);
        narrateText('World complete! Amazing work! Check out your stars!', 'celebration');
      }
    }, 1200);
  };

  const handleHint = () => {
    setShowHint(true);
    const q = questions[qIndex];
    if (q) narrateText(q.hint, 'thinking');
  };

  const handleWorldContinue = () => {
    setWorldComplete(false);
    navigate('/play');
  };

  if (questions.length === 0) {
    return (
      <div className="app-container">
        <StepperNav currentPhase="play" />
        <div className="phase-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ color: 'white', fontFamily: 'Baloo 2', fontSize: '1.2rem' }}>Loading questions...</div>
        </div>
      </div>
    );
  }

  const q = questions[qIndex];
  const progress = ((qIndex + 1) / questions.length) * 100;
  const ws = state.worlds[wId];

  return (
    <div className="app-container">
      <StepperNav currentPhase="play" />

      {popup && <AnswerPopup result={popup} correctAnswer={q.correct} />}
      {worldComplete && <WorldComplete worldName={world?.name || ''} correct={localCorrect} onContinue={handleWorldContinue} />}

      <div className="phase-content">
        <div style={{ maxWidth: '640px', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

          {/* World header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '9999px', padding: '0.3rem 0.8rem',
              fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '0.85rem', color: 'white'
            }}>
              {world?.icon} {world?.name}
            </div>
            {/* Stats */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[['⭐', ws?.starsEarned || 0], ['🔥', state.streak], ['✅', `${localCorrect}/${questions.length}`]].map(([icon, val]) => (
                <div key={icon} style={{
                  background: 'rgba(255,255,255,0.07)', borderRadius: '0.5rem',
                  padding: '0.25rem 0.5rem', fontFamily: 'Baloo 2', fontWeight: 800,
                  fontSize: '0.8rem', color: '#f5b81a', display: 'flex', gap: '0.2rem', alignItems: 'center'
                }}>
                  {icon} {val}
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                Q {qIndex + 1}/{questions.length}
              </span>
              <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.75rem', color: '#f5b81a' }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Question card */}
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {/* Diagram */}
            <div style={{ display: 'flex', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', padding: '0.5rem' }}>
              <ShapeDiagram type={q.diagramType} data={q.diagramData} size={180} />
            </div>

            {/* Question text */}
            <p style={{
              fontFamily: 'Nunito', fontWeight: 800, fontSize: '0.95rem',
              color: 'white', textAlign: 'center', lineHeight: 1.5
            }}>
              {q.prompt}
            </p>

            {/* Answer options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {q.options.map((option, i) => {
                let btnClass = 'answer-btn';
                if (selected !== null) {
                  if (option === q.correct) btnClass += ' correct';
                  else if (option === selected && option !== q.correct) btnClass += ' incorrect';
                  else btnClass += ' disabled';
                }
                return (
                  <button key={i} className={btnClass}
                    onClick={() => handleAnswer(option)}
                    disabled={selected !== null}
                    style={{ opacity: selected !== null && option !== q.correct && option !== selected ? 0.4 : 1 }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Hint */}
            <div>
              {!showHint ? (
                <button onClick={handleHint} style={{
                  background: 'none', border: '1px dashed rgba(245,184,26,0.4)', borderRadius: '0.75rem',
                  color: 'rgba(245,184,26,0.7)', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.8rem',
                  padding: '0.4rem 0.8rem', cursor: 'pointer', width: '100%', transition: 'all 0.2s'
                }}>
                  💡 Show Hint (costs XP bonus)
                </button>
              ) : (
                <div className="hint-panel">💡 {q.hint}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
