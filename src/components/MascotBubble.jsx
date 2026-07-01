export default function MascotBubble({ message, mood = 'idle', small = false }) {
  const size = small ? 40 : 52;
  const moodEmoji = mood === 'celebrating' ? '🎉' : mood === 'thinking' ? '🤔' : mood === 'encouraging' ? '💪' : '🐭';

  return (
    <div className="mascot-wrap">
      <div className="mascot-avatar" style={{width:size,height:size,fontSize:small?'1.2rem':'1.6rem'}}>
        {moodEmoji}
      </div>
      <div className="mascot-bubble" style={{fontSize:small?'0.8rem':'0.9rem'}}>
        {message}
      </div>
    </div>
  );
}
