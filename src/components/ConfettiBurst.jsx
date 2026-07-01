import { useEffect, useState } from 'react';

const COLORS = ['#f5b81a','#22c55e','#ec4899','#3b82f6','#a855f7','#ef4444','#ffcc33'];

export default function ConfettiBurst({ active }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) return;
    const newPieces = Array.from({length:60}, (_, i) => ({
      id: i,
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
      left: Math.random()*100,
      delay: Math.random()*1.5,
      duration: Math.random()*2+2,
      size: Math.random()*8+6,
      shape: Math.random() > 0.5 ? '50%' : '2px',
    }));
    setPieces(newPieces);
    const t = setTimeout(()=>setPieces([]), 4000);
    return ()=>clearTimeout(t);
  }, [active]);

  return (
    <>
      {pieces.map(p=>(
        <div key={p.id} className="confetti-piece" style={{
          left:`${p.left}%`, top:'-20px',
          backgroundColor:p.color,
          width:`${p.size}px`, height:`${p.size}px`,
          borderRadius:p.shape,
          animationDelay:`${p.delay}s`,
          animationDuration:`${p.duration}s`,
        }}/>
      ))}
    </>
  );
}
