import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StepperNav from '../components/StepperNav';
import { useGameState } from '../context/GameStateContext';
import { narrateText, stopNarration } from '../utils/audio';
import { storySlides } from '../data/storySlides';

function FarmIllustration({ slide }) {
  if (slide === 0) return (
    <svg width="260" height="130" viewBox="0 0 260 130">
      <rect x="0" y="0" width="260" height="130" fill="rgba(22,163,74,0.15)" rx="12"/>
      {/* Grid patch */}
      {Array.from({length:8},(_,c)=>Array.from({length:5},(_,r)=>(
        <rect key={`${c}-${r}`} x={20+c*26} y={15+r*20} width="26" height="20"
          fill="rgba(22,163,74,0.2)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
      )))}
      <rect x="20" y="15" width="208" height="100" fill="none" stroke="#22c55e" strokeWidth="2.5" rx="3"/>
      <text x="124" y="10" textAnchor="middle" style={{fontSize:'13px',fontWeight:'900',fill:'#f5b81a',fontFamily:'Baloo 2'}}>8 m</text>
      <text x="8" y="70" textAnchor="middle" style={{fontSize:'13px',fontWeight:'900',fill:'#f5b81a',fontFamily:'Baloo 2'}} transform="rotate(-90,8,70)">5 m</text>
      <text x="238" y="70" textAnchor="middle" style={{fontSize:'11px',fontWeight:'700',fill:'rgba(255,255,255,0.4)',fontFamily:'Nunito'}} transform="rotate(90,238,70)">5 m</text>
      <text x="124" y="128" textAnchor="middle" style={{fontSize:'11px',fontWeight:'700',fill:'rgba(255,255,255,0.4)',fontFamily:'Nunito'}}>8 m</text>
      {/* Farmer emoji */}
      <text x="235" y="100" style={{fontSize:'28px'}}>👨‍🌾</text>
      {/* Mouse */}
      <text x="22" y="130" style={{fontSize:'20px'}}>🐭</text>
    </svg>
  );
  if (slide === 1) return (
    <svg width="260" height="130" viewBox="0 0 260 130">
      <rect x="20" y="15" width="208" height="100" fill="rgba(22,163,74,0.15)" stroke="#22c55e" strokeWidth="2" rx="3"/>
      {/* Animated dotted path */}
      <rect x="20" y="15" width="208" height="100" fill="none" stroke="#f5b81a" strokeWidth="3" strokeDasharray="8,5" rx="3"/>
      {/* Running total callouts */}
      <text x="124" y="10" textAnchor="middle" style={{fontSize:'12px',fontWeight:'900',fill:'#f5b81a',fontFamily:'Baloo 2'}}>8 →</text>
      <text x="240" y="70" textAnchor="middle" style={{fontSize:'12px',fontWeight:'900',fill:'#22c55e',fontFamily:'Baloo 2'}} transform="rotate(90,240,70)">+5=13</text>
      <text x="124" y="128" textAnchor="middle" style={{fontSize:'12px',fontWeight:'900',fill:'#3b82f6',fontFamily:'Baloo 2'}}>+8=21</text>
      <text x="8" y="70" textAnchor="middle" style={{fontSize:'12px',fontWeight:'900',fill:'#ec4899',fontFamily:'Baloo 2'}} transform="rotate(-90,8,70)">+5=26!</text>
      <text x="104" y="70" textAnchor="middle" style={{fontSize:'14px',fontWeight:'900',fill:'white',fontFamily:'Baloo 2'}}>P = 26 m</text>
      <text x="22" y="128" style={{fontSize:'18px'}}>🐭</text>
    </svg>
  );
  if (slide === 2) return (
    <svg width="260" height="130" viewBox="0 0 260 130">
      {/* Square garden */}
      {Array.from({length:6},(_,c)=>Array.from({length:6},(_,r)=>(
        <rect key={`${c}-${r}`} x={40+c*30} y={10+r*18} width="30" height="18"
          fill="rgba(236,72,153,0.15)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
      )))}
      <rect x="40" y="10" width="180" height="108" fill="none" stroke="#ec4899" strokeWidth="2.5" rx="3"/>
      <text x="130" y="7" textAnchor="middle" style={{fontSize:'13px',fontWeight:'900',fill:'#f5b81a',fontFamily:'Baloo 2'}}>6 m</text>
      <text x="28" y="70" textAnchor="middle" style={{fontSize:'13px',fontWeight:'900',fill:'#f5b81a',fontFamily:'Baloo 2'}} transform="rotate(-90,28,70)">6 m</text>
      <text x="130" y="128" textAnchor="middle" style={{fontSize:'11px',fontWeight:'700',fill:'rgba(255,255,255,0.5)',fontFamily:'Nunito'}}>6 m</text>
      <text x="225" y="70" textAnchor="middle" style={{fontSize:'11px',fontWeight:'700',fill:'rgba(255,255,255,0.5)',fontFamily:'Nunito'}} transform="rotate(90,225,70)">6 m</text>
      {/* Formula */}
      <rect x="65" y="48" width="130" height="32" fill="rgba(245,184,26,0.2)" rx="8" stroke="rgba(245,184,26,0.5)" strokeWidth="1.5"/>
      <text x="130" y="69" textAnchor="middle" style={{fontSize:'14px',fontWeight:'900',fill:'#f5b81a',fontFamily:'Baloo 2'}}>4 × 6 = 24 m</text>
      <text x="8" y="128" style={{fontSize:'20px'}}>🐭</text>
      <text x="228" y="25" style={{fontSize:'22px'}}>🌸</text>
    </svg>
  );
  // slide 3 - L-shape
  return (
    <svg width="260" height="140" viewBox="0 0 260 140">
      {/* L-shape */}
      <polygon points="20,10 180,10 180,70 110,70 110,130 20,130"
        fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="2.5"/>
      {/* Side labels */}
      <text x="100" y="7" textAnchor="middle" style={{fontSize:'12px',fontWeight:'900',fill:'#f5b81a',fontFamily:'Baloo 2'}}>10 m</text>
      <text x="182" y="43" textAnchor="start" style={{fontSize:'12px',fontWeight:'900',fill:'#22c55e',fontFamily:'Baloo 2'}}>6 m</text>
      <text x="148" y="83" textAnchor="middle" style={{fontSize:'12px',fontWeight:'900',fill:'#f5b81a',fontFamily:'Baloo 2'}}>7 m</text>
      <text x="112" y="103" textAnchor="start" style={{fontSize:'12px',fontWeight:'900',fill:'#ef4444',fontFamily:'Baloo 2'}}>?</text>
      <text x="65" y="143" textAnchor="middle" style={{fontSize:'12px',fontWeight:'900',fill:'#f5b81a',fontFamily:'Baloo 2'}}>3 m</text>
      <text x="8" y="73" textAnchor="middle" style={{fontSize:'12px',fontWeight:'900',fill:'#f5b81a',fontFamily:'Baloo 2'}} transform="rotate(-90,8,73)">12 m</text>
      <text x="20" y="135" style={{fontSize:'18px'}}>🐭</text>
      <text x="185" y="30" style={{fontSize:'18px'}}>🔍</text>
    </svg>
  );
}

export default function StoryPage() {
  const navigate = useNavigate();
  const { dispatch } = useGameState();
  const [current, setCurrent] = useState(0);
  const total = storySlides.length;

  const narrate = useCallback((idx) => {
    stopNarration();
    const slide = storySlides[idx];
    if (slide) setTimeout(() => narrateText(slide.narration, 'statement'), 500);
  }, []);

  useEffect(() => { narrate(0); return () => stopNarration(); }, [narrate]);

  const goNext = () => {
    stopNarration();
    if (current < total - 1) {
      const next = current + 1;
      setCurrent(next);
      narrate(next);
    } else {
      dispatch({ type: 'COMPLETE_PHASE', phase: 'story' });
      navigate('/simulate');
    }
  };

  const goPrev = () => {
    stopNarration();
    if (current > 0) {
      const prev = current - 1;
      setCurrent(prev);
      narrate(prev);
    }
  };

  const slide = storySlides[current];

  return (
    <div className="app-container">
      <StepperNav currentPhase="story" />
      <div className="phase-content">
        <div style={{ maxWidth: '660px', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>

          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Baloo 2', fontWeight: 900, fontSize: '1.6rem', color: '#f5b81a' }}>
              📖 02 — Story
            </h2>
            {/* Progress dots */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.3rem' }}>
              {storySlides.map((_, i) => (
                <div key={i} style={{
                  width: i === current ? '24px' : '8px', height: '8px',
                  borderRadius: '9999px', transition: 'all 0.3s',
                  background: i === current ? '#f5b81a' : i < current ? '#22c55e' : 'rgba(255,255,255,0.2)'
                }} />
              ))}
            </div>
          </div>

          {/* Slide card */}
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {/* Illustration */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <FarmIllustration slide={current} />
            </div>

            {/* Title */}
            <h3 style={{ fontFamily: 'Baloo 2', fontWeight: 900, fontSize: '1.2rem', color: '#f5b81a', textAlign: 'center' }}>
              {slide.title}
            </h3>

            {/* Paragraph */}
            <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
              {slide.paragraph}
            </p>

            {/* Formula pill */}
            <div style={{ textAlign: 'center' }}>
              <span className="formula-pill">{slide.formulaPill}</span>
            </div>

            {/* Mascot tip */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#f5b81a,#ffcc33)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', boxShadow: '0 2px 8px rgba(245,184,26,0.4)'
              }}>🐭</div>
              <div style={{
                background: 'white', color: '#1a1245', borderRadius: '0.75rem',
                borderBottomLeftRadius: '0.2rem', padding: '0.4rem 0.8rem',
                fontFamily: 'Nunito', fontWeight: 800, fontSize: '0.8rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                {slide.mascotTip}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <button className="btn-secondary" onClick={goPrev} disabled={current === 0}
              style={{ opacity: current === 0 ? 0.3 : 1, minWidth: '110px' }}>
              ← Previous
            </button>
            <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
              {current + 1} / {total}
            </span>
            <button className="btn-gold" onClick={goNext} style={{ minWidth: '130px', padding: '0.7rem 1.5rem', fontSize: '0.95rem' }}>
              {current < total - 1 ? 'Next →' : '🔬 Simulate!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
