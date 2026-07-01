import { useNavigate } from 'react-router-dom';
import { useGameState } from '../context/GameStateContext';
import { setMuted } from '../utils/audio';

const phases = [
  { key:'wonder',   label:'Wonder',   icon:'🔍', path:'/wonder',   num:'01' },
  { key:'story',    label:'Story',    icon:'📖', path:'/story',    num:'02' },
  { key:'simulate', label:'Simulate', icon:'🔬', path:'/simulate', num:'03' },
  { key:'play',     label:'Play',     icon:'🎮', path:'/play',     num:'04' },
  { key:'reflect',  label:'Reflect',  icon:'🏆', path:'/reflect',  num:'05' },
];

const phaseOrder = ['wonder','story','simulate','play','reflect'];

export default function StepperNav({ currentPhase }) {
  const { state, dispatch } = useGameState();
  const navigate = useNavigate();
  const currentIdx = phaseOrder.indexOf(currentPhase);

  return (
    <nav className="stepper-nav">
      <div style={{display:'flex',alignItems:'center',gap:'0.2rem',flex:1,justifyContent:'center'}}>
        {phases.map((p, i) => {
          const completed = state.phaseStatus[p.key];
          const active = p.key === currentPhase;
          const canNav = completed || active || i < currentIdx;

          let cls = 'stepper-item ';
          if (active) cls += 'active';
          else if (completed) cls += 'completed';
          else cls += 'locked';

          return (
            <div key={p.key} style={{display:'flex',alignItems:'center',gap:'0.2rem'}}>
              {i > 0 && <div className="stepper-connector" />}
              <button
                className={cls}
                onClick={() => canNav && navigate(p.path)}
                style={{cursor: canNav ? 'pointer':'default', border:'none'}}
                aria-label={`Phase ${p.num}: ${p.label}`}
              >
                <span>{p.icon}</span>
                <span style={{fontSize:'0.65rem'}}>{p.num} {p.label}</span>
                {completed && <span style={{color:'#22c55e',marginLeft:'2px'}}>✓</span>}
                {!completed && !active && <span style={{marginLeft:'2px'}}>🔒</span>}
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          const newMuted = !state.muted;
          dispatch({ type:'SET_MUTED', muted: newMuted });
          setMuted(newMuted);
        }}
        style={{
          background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
          borderRadius:'50%', width:'32px',height:'32px', cursor:'pointer',
          fontSize:'1rem', color:'white', display:'flex',alignItems:'center',
          justifyContent:'center', flexShrink:0, marginLeft:'0.5rem'
        }}
        aria-label={state.muted ? 'Unmute' : 'Mute'}
      >
        {state.muted ? '🔇' : '🔊'}
      </button>
    </nav>
  );
}
