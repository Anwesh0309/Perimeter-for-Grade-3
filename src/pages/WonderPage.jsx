import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';

const NARRATION =
  "Hmm... I wonder something! Farmer Ben from Cornwall wants to put a fence all the way around his rectangular vegetable patch that is 8 metres long and 5 metres wide. How much fencing does he need? What if the shape is not a simple rectangle, with L-shapes and missing sides? We might need to add up every single outer side to find the answer. Let us investigate together!";

export default function WonderPage() {
  const navigate = useNavigate();
  const { dispatch } = useGameState();
  const timerRef = useRef(null);

  useEffect(() => {
    stopNarration(); // kill any carry-over from previous page
    timerRef.current = setTimeout(() => narrateText(NARRATION, 'thinking'), 500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      stopNarration(); // kill before next page loads
    };
  }, []);

  const handleGo = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    stopNarration();
    dispatch({ type: 'COMPLETE_PHASE', phase: 'wonder' });
    navigate('/story');
  };

  return (
    <PageShell phase="wonder">
      <div style={{
        maxWidth:'560px', width:'100%',
        display:'flex', flexDirection:'column', alignItems:'center', gap:'1.1rem',
      }}>
        {/* Mascot */}
        <div className="mascot-row">
          <div className="mascot-avatar">🐭</div>
          <div className="speech-bubble">Hmm... I wonder... 🤔</div>
        </div>

        {/* Wonder card */}
        <div className="card" style={{
          width:'100%', padding:'2rem',
          textAlign:'center', display:'flex', flexDirection:'column',
          alignItems:'center', gap:'1rem',
        }}>
          {/* Icon circle */}
          <div style={{
            width:72, height:72, borderRadius:'50%',
            background:'rgba(124,58,237,0.35)',
            border:'2px solid rgba(124,58,237,0.6)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'2rem',
          }}>📏</div>

          {/* Hook question */}
          <h2 style={{
            fontFamily:'Baloo 2', fontWeight:900,
            fontSize:'clamp(1.1rem,3vw,1.4rem)', color:'#fff',
            lineHeight:1.45, maxWidth:'420px',
          }}>
            Farmer Ben wants to put a fence all around his rectangular vegetable patch that is{' '}
            <span style={{ color:'var(--gold)' }}>8 m long</span> and{' '}
            <span style={{ color:'var(--gold)' }}>5 m wide</span>.
            How much fencing does he need?
          </h2>

          {/* Sub-prompt */}
          <p style={{
            fontFamily:'Nunito', fontStyle:'italic', fontWeight:600,
            fontSize:'0.88rem', color:'rgba(255,255,255,0.55)',
          }}>
            What if the patch isn't a perfect rectangle?
          </p>

          {/* Hint pill */}
          <div style={{
            background:'rgba(255,255,255,0.07)',
            border:'1px solid rgba(255,255,255,0.2)',
            borderRadius:'0.65rem', padding:'0.55rem 1.2rem',
            fontFamily:'Baloo 2', fontWeight:800, fontSize:'0.9rem',
            color:'var(--gold)', width:'100%',
          }}>
            ✨ We might need to add up all four sides! ✨
          </div>
        </div>

        {/* CTA */}
        <button className="btn-gold"
          style={{ width:'100%', maxWidth:'300px' }}
          onClick={handleGo}>
          🔍 Let&apos;s Investigate!
        </button>
      </div>
    </PageShell>
  );
}
