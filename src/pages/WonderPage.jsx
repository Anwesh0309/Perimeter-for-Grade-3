import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import StepperNav from '../components/StepperNav';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';
import { narrationScripts } from '../utils/narration';

export default function WonderPage() {
  const navigate = useNavigate();
  const { dispatch } = useGameState();

  useEffect(() => {
    const t = setTimeout(()=>narrateText(narrationScripts.wonder.hook, 'thinking'), 600);
    return () => { clearTimeout(t); stopNarration(); };
  }, []);

  const handleNext = () => {
    dispatch({ type:'COMPLETE_PHASE', phase:'wonder' });
    navigate('/story');
  };

  return (
    <div className="app-container">
      <StepperNav currentPhase="wonder" />
      <div className="phase-content">
        <div style={{
          maxWidth:'600px',width:'100%',display:'flex',flexDirection:'column',
          alignItems:'center',gap:'1rem'
        }}>
          {/* Header */}
          <div style={{textAlign:'center'}}>
            <h2 style={{fontFamily:'Baloo 2',fontWeight:900,fontSize:'1.8rem',color:'#f5b81a'}}>
              01 — Wonder
            </h2>
            <p style={{color:'rgba(255,255,255,0.6)',fontFamily:'Nunito',fontWeight:600,fontSize:'0.85rem'}}>
              Spark your curiosity!
            </p>
          </div>

          {/* Mascot */}
          <div style={{display:'flex',alignItems:'flex-start',gap:'0.75rem'}}>
            <div style={{
              width:'56px',height:'56px',borderRadius:'50%',flexShrink:0,
              background:'linear-gradient(135deg,#f5b81a,#ffcc33)',
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem',
              boxShadow:'0 4px 16px rgba(245,184,26,0.5)',
              animation:'mascot-bounce 2s ease-in-out infinite'
            }}>🐭</div>
            <div style={{
              background:'white',color:'#1a1245',borderRadius:'1rem',borderBottomLeftRadius:'0.25rem',
              padding:'0.6rem 1rem',fontFamily:'Nunito',fontWeight:800,fontSize:'0.9rem',
              boxShadow:'0 4px 12px rgba(0,0,0,0.2)'
            }}>
              Hmm... I wonder... 🤔
            </div>
          </div>

          {/* Wonder card */}
          <div className="glass-card" style={{width:'100%',padding:'1.5rem',textAlign:'center'}}>
            <div style={{fontSize:'3rem',marginBottom:'0.5rem'}}>📏</div>
            <h3 style={{
              fontFamily:'Baloo 2',fontWeight:900,fontSize:'1.3rem',
              color:'white',marginBottom:'0.75rem',lineHeight:1.3
            }}>
              Farmer Ben wants to put a fence all around his rectangular vegetable patch that is <span style={{color:'#f5b81a'}}>8 m long</span> and <span style={{color:'#f5b81a'}}>5 m wide</span>. How much fencing does he need?
            </h3>
            <p style={{
              fontFamily:'Nunito',fontWeight:600,fontSize:'0.85rem',
              color:'rgba(255,255,255,0.6)',fontStyle:'italic',marginBottom:'1rem'
            }}>
              What if the patch is not a perfect rectangle?
            </p>

            {/* Simple diagram */}
            <svg width="220" height="120" viewBox="0 0 220 120" style={{margin:'0 auto 1rem',display:'block'}}>
              <rect x="20" y="15" width="180" height="90" fill="rgba(124,58,237,0.2)" stroke="#7c3aed" strokeWidth="2.5" rx="4"/>
              <text x="110" y="10" textAnchor="middle" style={{fontSize:'14px',fontWeight:'900',fill:'#f5b81a',fontFamily:'Baloo 2'}}>8 m</text>
              <text x="8" y="65" textAnchor="middle" style={{fontSize:'14px',fontWeight:'900',fill:'#f5b81a',fontFamily:'Baloo 2'}} transform="rotate(-90,8,65)">5 m</text>
              <text x="110" y="118" textAnchor="middle" style={{fontSize:'12px',fontWeight:'700',fill:'rgba(255,255,255,0.5)',fontFamily:'Nunito'}}>8 m</text>
              <text x="208" y="65" textAnchor="middle" style={{fontSize:'12px',fontWeight:'700',fill:'rgba(255,255,255,0.5)',fontFamily:'Nunito'}} transform="rotate(90,208,65)">5 m</text>
              {/* Dotted border trace */}
              <rect x="20" y="15" width="180" height="90" fill="none" stroke="#f5b81a" strokeWidth="1.5" strokeDasharray="6,4" rx="4"/>
            </svg>

            {/* Hint pill */}
            <div style={{
              display:'inline-flex',alignItems:'center',gap:'0.5rem',
              background:'rgba(245,184,26,0.15)',border:'2px solid rgba(245,184,26,0.5)',
              borderRadius:'9999px',padding:'0.4rem 1.2rem',
              fontFamily:'Baloo 2',fontWeight:800,fontSize:'0.9rem',color:'#f5b81a'
            }}>
              ✨ We might need to add up all four sides! ✨
            </div>
          </div>

          {/* CTA */}
          <button className="btn-gold" onClick={handleNext} style={{width:'100%',maxWidth:'320px'}}>
            🔍 Let&apos;s Investigate!
          </button>
        </div>
      </div>
    </div>
  );
}
