import { useEffect, useState } from 'react';

export default function ScoreRing({ percentage, fraction, size = 160 }) {
  const [animated, setAnimated] = useState(0);
  const r = (size/2) - 12;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated/100)*circ;

  useEffect(() => {
    const t = setTimeout(()=>setAnimated(percentage), 300);
    return ()=>clearTimeout(t);
  }, [percentage]);

  const color = percentage >= 90 ? '#22c55e' : percentage >= 70 ? '#f5b81a' : percentage >= 50 ? '#3b82f6' : '#ef4444';

  return (
    <div className="score-ring-container" style={{width:size,height:size}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10"/>
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{transition:'stroke-dashoffset 1.2s ease'}}
        />
      </svg>
      <div style={{
        position:'absolute', inset:0, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', gap:'2px'
      }}>
        <span style={{fontSize:'2rem',fontWeight:'900',fontFamily:'Baloo 2',color}}>{percentage}%</span>
        <span style={{fontSize:'0.85rem',fontWeight:'700',color:'rgba(255,255,255,0.6)',fontFamily:'Nunito'}}>{fraction}</span>
      </div>
    </div>
  );
}
