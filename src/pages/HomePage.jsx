import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';

const journeySteps = [
  { icon:'🔍', label:'Wonder', desc:'Spark your curiosity', phase:'wonder' },
  { icon:'📖', label:'Story', desc:"Meet Mira's mission", phase:'story' },
  { icon:'🔬', label:'Simulate', desc:'Build & measure shapes', phase:'simulate' },
  { icon:'🎮', label:'Play', desc:'Test your skills', phase:'play' },
  { icon:'🏆', label:'Reflect', desc:"See how far you've come", phase:'reflect' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { state } = useGameState();

  useEffect(() => {
    const text = "Welcome to Perimeter Quest! I am Mira the Measuring Mouse, and I am here to guide you on an amazing adventure to learn about perimeter! We will explore shapes, measure edges, and solve exciting puzzles together. Are you ready to begin your journey? Click Begin Your Journey to start!";
    const t = setTimeout(()=>narrateText(text, 'statement'), 800);
    return () => { clearTimeout(t); stopNarration(); };
  }, []);

  return (
    <div className="phase-content" style={{flexDirection:'column',gap:'0',overflow:'hidden'}}>
      <div style={{
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        width:'100%',maxWidth:'680px',gap:'0.6rem',
        padding:'0.5rem'
      }}>
        {/* Badge */}
        <div style={{
          background:'rgba(245,184,26,0.15)',border:'2px solid rgba(245,184,26,0.5)',
          borderRadius:'9999px',padding:'0.3rem 1rem',
          fontSize:'0.75rem',fontWeight:'800',color:'#f5b81a',fontFamily:'Baloo 2',
          letterSpacing:'0.05em'
        }}>
          ✨ Grade 3 Mathematics — Perimeter Adventure
        </div>

        {/* Mascot + Title */}
        <div style={{display:'flex',alignItems:'center',gap:'1rem',flexWrap:'wrap',justifyContent:'center'}}>
          <div style={{
            width:'72px',height:'72px',borderRadius:'50%',flexShrink:0,
            background:'linear-gradient(135deg,#f5b81a,#ffcc33)',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:'2.4rem',boxShadow:'0 4px 20px rgba(245,184,26,0.6)',
            animation:'mascot-bounce 2s ease-in-out infinite'
          }}>
            🐭
          </div>
          <div style={{textAlign:'center'}}>
            <h1 style={{
              fontFamily:'Baloo 2',fontWeight:900,fontSize:'clamp(2rem,5vw,3.2rem)',
              lineHeight:1.1,letterSpacing:'-0.02em'
            }}>
              <span style={{color:'white'}}>Perimeter </span>
              <span style={{color:'#f5b81a'}}>Quest</span>
            </h1>
            <p style={{
              fontFamily:'Nunito',fontWeight:700,fontSize:'0.85rem',
              color:'rgba(255,255,255,0.7)',maxWidth:'380px'
            }}>
              Join Mira on an adventure to measure the edges of shapes through stories, simulations, and fun games!
            </p>
          </div>
        </div>

        {/* Mascot bubble */}
        <div style={{
          background:'white',color:'#1a1245',borderRadius:'1rem',borderBottomLeftRadius:'0.25rem',
          padding:'0.5rem 1rem',fontFamily:'Nunito',fontWeight:800,fontSize:'0.9rem',
          boxShadow:'0 4px 12px rgba(0,0,0,0.2)',maxWidth:'360px',textAlign:'center'
        }}>
          Ready to measure some shapes? 📏
        </div>

        {/* Journey steps */}
        <div className="glass-card" style={{width:'100%',padding:'0.75rem'}}>
          <h2 style={{fontFamily:'Baloo 2',fontWeight:800,fontSize:'1rem',
            textAlign:'center',marginBottom:'0.5rem',color:'#f5b81a'}}>
            🗺️ Your Learning Journey
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'0.4rem'}}>
            {journeySteps.map((step) => {
              const done = state.phaseStatus[step.phase];
              return (
                <div key={step.phase} style={{
                  textAlign:'center',padding:'0.5rem 0.25rem',borderRadius:'0.75rem',
                  background: done ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                  border: done ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{fontSize:'1.4rem'}}>{step.icon}</div>
                  <div style={{fontFamily:'Baloo 2',fontWeight:800,fontSize:'0.75rem',color:done?'#22c55e':'white'}}>
                    {step.label} {done&&'✓'}
                  </div>
                  <div style={{fontFamily:'Nunito',fontWeight:600,fontSize:'0.65rem',color:'rgba(255,255,255,0.5)'}}>
                    {step.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature chips */}
        <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',justifyContent:'center'}}>
          {[['📐','Shape Lab','interactive builder'],['🧱','Simulations','4 hands-on stations'],['🏆','10 Game Worlds','100 questions']].map(([icon,name,sub])=>(
            <div key={name} style={{
              background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',
              borderRadius:'9999px',padding:'0.3rem 0.8rem',
              display:'flex',alignItems:'center',gap:'0.3rem',
              fontFamily:'Nunito',fontWeight:700,fontSize:'0.75rem'
            }}>
              <span>{icon}</span>
              <div>
                <span style={{fontWeight:800}}>{name}</span>
                <span style={{color:'rgba(255,255,255,0.5)',marginLeft:'0.3rem'}}>{sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="btn-gold" style={{fontSize:'1.1rem',padding:'0.85rem 2.5rem',width:'100%',maxWidth:'340px'}}
          onClick={()=>navigate('/wonder')}>
          🚀 Begin Your Journey!
        </button>
      </div>
    </div>
  );
}
