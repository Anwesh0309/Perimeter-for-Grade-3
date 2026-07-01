// SVG shape renderer for quiz questions and simulations

export default function ShapeDiagram({ type, data, size = 200 }) {
  if (!data) return null;

  switch(type) {
    case 'rectangle': return <RectDiagram data={data} size={size} />;
    case 'square':    return <RectDiagram data={{L:data.side,B:data.side}} size={size} isSquare />;
    case 'grid':      return <GridDiagram data={data} size={size} />;
    case 'polygon':   return <PolygonDiagram data={data} size={size} />;
    case 'composite': return <CompositeDiagram data={data} size={size} />;
    default:          return <RectDiagram data={data} size={size} />;
  }
}

function RectDiagram({ data, size, isSquare }) {
  const { L, B, missingB, missingL } = data;
  const pad = 40;
  const w = size - pad*2;
  const h = Math.max(60, Math.round(w * B / L));
  const svgH = h + pad*2;

  const labelStyle = { fontSize:'13px', fontWeight:'800', fill:'#f5b81a', fontFamily:'Baloo 2, sans-serif' };
  const dimStyle = { fontSize:'11px', fontWeight:'700', fill:'rgba(255,255,255,0.6)', fontFamily:'Nunito, sans-serif' };

  return (
    <svg width={size} height={svgH} viewBox={`0 0 ${size} ${svgH}`} style={{overflow:'visible'}}>
      {/* Grid bg */}
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect x={pad} y={pad} width={w} height={h} fill="url(#grid)" stroke="#7c3aed" strokeWidth="2.5" rx="3"/>
      <rect x={pad} y={pad} width={w} height={h} fill="rgba(124,58,237,0.15)" rx="3"/>

      {/* Labels */}
      {/* Top - Length */}
      <text x={pad+w/2} y={pad-10} textAnchor="middle" style={labelStyle}>
        {missingL ? '?' : `${L} cm`}
      </text>
      {/* Bottom */}
      <text x={pad+w/2} y={pad+h+22} textAnchor="middle" style={dimStyle}>
        {isSquare ? `${L} cm` : `${L} cm`}
      </text>
      {/* Left - Breadth */}
      <text x={pad-14} y={pad+h/2+5} textAnchor="middle" style={labelStyle}
        transform={`rotate(-90, ${pad-14}, ${pad+h/2+5})`}>
        {missingB ? '?' : `${B} cm`}
      </text>
      {/* Right */}
      <text x={pad+w+14} y={pad+h/2+5} textAnchor="middle" style={dimStyle}
        transform={`rotate(90, ${pad+w+14}, ${pad+h/2+5})`}>
        {isSquare ? `${L} cm` : `${B} cm`}
      </text>

      {/* Dimension arrows */}
      <line x1={pad} y1={pad} x2={pad+w} y2={pad} stroke="#7c3aed" strokeWidth="2" markerEnd="url(#arrow)"/>
      <line x1={pad} y1={pad} x2={pad} y2={pad+h} stroke="#7c3aed" strokeWidth="2"/>
    </svg>
  );
}

function GridDiagram({ data, size }) {
  const { L, B } = data;
  const cellSize = Math.min(Math.floor((size-60)/Math.max(L,B)), 28);
  const gw = L * cellSize;
  const gh = B * cellSize;
  const padX = (size - gw) / 2;
  const padY = 20;
  const svgH = gh + padY * 2 + 30;

  const cells = [];
  for (let r=0;r<B;r++) for(let c=0;c<L;c++) {
    cells.push(<rect key={`${r}-${c}`} x={padX+c*cellSize} y={padY+r*cellSize}
      width={cellSize} height={cellSize} fill="rgba(124,58,237,0.15)"
      stroke="rgba(124,58,237,0.4)" strokeWidth="1"/>);
  }

  return (
    <svg width={size} height={svgH} viewBox={`0 0 ${size} ${svgH}`}>
      {cells}
      <rect x={padX} y={padY} width={gw} height={gh} fill="none" stroke="#7c3aed" strokeWidth="2.5" rx="2"/>
      <text x={padX+gw/2} y={padY-6} textAnchor="middle" style={{fontSize:'12px',fontWeight:'800',fill:'#f5b81a',fontFamily:'Baloo 2'}}>
        {L} units
      </text>
      <text x={padX-12} y={padY+gh/2+4} textAnchor="middle" style={{fontSize:'12px',fontWeight:'800',fill:'#f5b81a',fontFamily:'Baloo 2'}}
        transform={`rotate(-90,${padX-12},${padY+gh/2+4})`}>
        {B} units
      </text>
    </svg>
  );
}

function PolygonDiagram({ data, size }) {
  const { sides, sideLen } = data;
  const cx = size/2, cy = size/2 - 10;
  const r = size/2 - 35;
  const points = [];
  for(let i=0;i<sides;i++){
    const angle = (2*Math.PI*i/sides) - Math.PI/2;
    points.push({x: cx + r*Math.cos(angle), y: cy + r*Math.sin(angle)});
  }
  const polyStr = points.map(p=>`${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon points={polyStr} fill="rgba(124,58,237,0.2)" stroke="#7c3aed" strokeWidth="2.5"/>
      {/* Label one side */}
      {points.length > 1 && (
        <text
          x={(points[0].x+points[1].x)/2}
          y={(points[0].y+points[1].y)/2 + 16}
          textAnchor="middle"
          style={{fontSize:'13px',fontWeight:'800',fill:'#f5b81a',fontFamily:'Baloo 2'}}
        >
          {sideLen} cm
        </text>
      )}
      <text x={cx} y={cy+5} textAnchor="middle"
        style={{fontSize:'11px',fontWeight:'700',fill:'rgba(255,255,255,0.5)',fontFamily:'Nunito'}}>
        {sides} sides
      </text>
    </svg>
  );
}

function CompositeDiagram({ data, size }) {
  // L-shape: outer a×b, corner d×c removed from top-right
  const { a, b, c, d, missingSide } = data;
  const scale = Math.min((size-50)/a, (size-50)/b);
  const ox = 25, oy = 25;
  const W = a*scale, H = b*scale;
  const CW = d*scale, CH = c*scale;

  // L-shape points (going clockwise from bottom-left)
  const pts = [
    [ox, oy+H],          // bottom-left
    [ox+W, oy+H],        // bottom-right
    [ox+W, oy+CH],       // right partial top
    [ox+W-CW, oy+CH],    // inner corner horizontal
    [ox+W-CW, oy],       // inner corner vertical
    [ox, oy],            // top-left
  ];
  const pStr = pts.map(p=>p.join(',')).join(' ');

  const labelStyle = {fontSize:'11px',fontWeight:'800',fill:'#f5b81a',fontFamily:'Baloo 2'};
  const missingStyle = {fontSize:'11px',fontWeight:'800',fill:'#ef4444',fontFamily:'Baloo 2'};

  const sides = [a, b, a-d, c, d, b-c];
  const labels = [
    {x:ox+W/2, y:oy+H+16, anchor:'middle'},      // bottom
    {x:ox+W+12, y:oy+H/2, anchor:'start'},         // right
    {x:ox+(W-CW)/2, y:oy-8, anchor:'middle'},      // top
    {x:ox+W-CW+12, y:oy+CH/2, anchor:'start'},     // inner-right
    {x:ox+W-CW/2, y:oy+CH+14, anchor:'middle'},    // inner-bottom
    {x:ox-10, y:oy+H/2, anchor:'end'},             // left
  ];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon points={pStr} fill="rgba(124,58,237,0.2)" stroke="#7c3aed" strokeWidth="2.5"/>
      {labels.map((lbl,i)=>(
        <text key={i} x={lbl.x} y={lbl.y} textAnchor={lbl.anchor}
          style={i===missingSide ? missingStyle : labelStyle}>
          {i===missingSide ? '?' : `${sides[i]}`}
        </text>
      ))}
    </svg>
  );
}
