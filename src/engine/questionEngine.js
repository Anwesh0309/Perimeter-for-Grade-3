// Question Engine - generates randomized instances from templates
// 100 templates across 10 worlds (10 per world)

// Seeded random state
let _seed = 12345;
export function setSeed(val) {
  if (typeof val === 'string') {
    let hash = 0;
    for (let i = 0; i < val.length; i++) {
      hash = (hash << 5) - hash + val.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    _seed = hash;
  } else {
    _seed = val;
  }
}

export function seededRandom() {
  let t = _seed += 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function rnd(min, max) {
  return Math.floor(seededRandom() * (max - min + 1)) + min;
}

function makeDistractors(correct, params, shapeType) {
  const candidates = new Set();
  const { L, B, side, sides, n } = params;

  // Error pattern 1: only 2 sides (forgot to double)
  const d1 = Math.round(correct / 2);
  if (d1 > 0 && d1 !== correct) candidates.add(d1);

  // Error pattern 2: area-style (L*B or side*side)
  if (L && B) {
    const d2 = L * B;
    if (d2 !== correct && d2 > 0) candidates.add(d2);
  }
  if (side) {
    const d2 = side * side;
    if (d2 !== correct && d2 > 0 && d2 < 200) candidates.add(d2);
  }

  // Error pattern 3: subtract one side
  const oneSide = L || side || (sides && sides[0]) || 3;
  const d3 = correct - oneSide;
  if (d3 > 0 && d3 !== correct) candidates.add(d3);

  // Error pattern 4: arithmetic slip +2
  if (correct + 2 !== correct) candidates.add(correct + 2);
  // Error pattern 5: arithmetic slip -2
  if (correct - 2 > 0) candidates.add(correct - 2);
  // Error pattern 6: +4
  candidates.add(correct + 4);

  const arr = [...candidates].filter(v => v !== correct && v > 0);
  const unique = [...new Set(arr)];
  // shuffle using Fisher-Yates
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }
  return unique.slice(0, 3);
}

// Template definitions: 100 templates, 10 per world
const templates = [
  // ===== WORLD 1: Garden Fence (Rectangles) =====
  {
    id:"w1q1", worldId:1,
    gen:()=>{ const L=rnd(4,15), B=rnd(2,L-1); const c=2*(L+B);
      return {prompt:`A rectangular garden in Cornwall is ${L} cm long and ${B} cm wide. What is its perimeter?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Add all four sides: ${L} + ${B} + ${L} + ${B}. Or use 2 × (length + breadth).`}; }
  },
  {
    id:"w1q2", worldId:1,
    gen:()=>{ const L=rnd(5,18), B=rnd(2,L-1); const c=2*(L+B);
      return {prompt:`Farmer Ben's vegetable patch in Devon is ${L} m long and ${B} m wide. How much fencing does he need to go all the way around it?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Perimeter of rectangle = 2 × (length + breadth) = 2 × (${L} + ${B})`}; }
  },
  {
    id:"w1q3", worldId:1,
    gen:()=>{ const L=rnd(6,20), B=rnd(3,L-1); const c=2*(L+B);
      return {prompt:`A rectangular field near York is ${L} m long and ${B} m wide. What is the perimeter of the field?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`P = 2 × (L + B). First add ${L} + ${B}, then multiply by 2.`}; }
  },
  {
    id:"w1q4", worldId:1,
    gen:()=>{ const L=rnd(7,16), B=rnd(3,L-2); const c=2*(L+B);
      return {prompt:`A rectangular swimming pool in Manchester is ${L} m long and ${B} m wide. What is the total length of its border?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`All four sides: top + right + bottom + left = ${L} + ${B} + ${L} + ${B}`}; }
  },
  {
    id:"w1q5", worldId:1,
    gen:()=>{ const L=rnd(8,19), B=rnd(4,L-2); const c=2*(L+B);
      return {prompt:`A rectangular classroom in Edinburgh is ${L} m long and ${B} m wide. How long is the total edge of the room?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Perimeter = 2 × (${L} + ${B})`}; }
  },
  {
    id:"w1q6", worldId:1,
    gen:()=>{ const L=rnd(5,14), B=rnd(2,L-1); const c=2*(L+B);
      return {prompt:`Oliver wants to put a ribbon around a rectangular photo frame that is ${L} cm long and ${B} cm wide. How much ribbon does he need?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Ribbon length = perimeter = 2 × (length + breadth)`}; }
  },
  {
    id:"w1q7", worldId:1,
    gen:()=>{ const L=rnd(9,20), B=rnd(4,L-3); const c=2*(L+B);
      return {prompt:`A rectangular playground in Bristol is ${L} m long and ${B} m wide. What is its perimeter?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`2 × (length + breadth) = 2 × (${L} + ${B})`}; }
  },
  {
    id:"w1q8", worldId:1,
    gen:()=>{ const L=rnd(6,17), B=rnd(3,L-2); const c=2*(L+B);
      return {prompt:`A rectangular park in Cambridge is ${L} m long and ${B} m wide. James jogs once around the park. How far does he jog?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Distance jogged = perimeter = 2 × (${L} + ${B})`}; }
  },
  {
    id:"w1q9", worldId:1,
    gen:()=>{ const L=rnd(10,18), B=rnd(5,L-3); const c=2*(L+B);
      return {prompt:`A rectangular football pitch in Liverpool is ${L} m long and ${B} m wide. What is the total distance around the pitch?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Perimeter = 2 × (L + B) = 2 × (${L} + ${B})`}; }
  },
  {
    id:"w1q10", worldId:1,
    gen:()=>{ const L=rnd(7,15), B=rnd(3,L-2); const c=2*(L+B);
      return {prompt:`A rectangular table in Oxford is ${L} cm long and ${B} cm wide. What is the perimeter of the tabletop?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Add all sides: ${L} + ${B} + ${L} + ${B} = ?`}; }
  },

  // ===== WORLD 2: Tile Town (Squares) =====
  {
    id:"w2q1", worldId:2,
    gen:()=>{ const s=rnd(3,15); const c=4*s;
      return {prompt:`A square tile in a London shop has sides of ${s} cm each. What is the perimeter of the tile?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`Square perimeter = 4 × side = 4 × ${s}`}; }
  },
  {
    id:"w2q2", worldId:2,
    gen:()=>{ const s=rnd(4,18); const c=4*s;
      return {prompt:`A square garden in Bath has each side measuring ${s} m. How much fencing is needed to enclose it completely?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`P = 4 × ${s}`}; }
  },
  {
    id:"w2q3", worldId:2,
    gen:()=>{ const s=rnd(5,14); const c=4*s;
      return {prompt:`A square classroom wall painting in Cardiff has a side length of ${s} cm. What is the total length of its border?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`Perimeter of a square = 4 × side length`}; }
  },
  {
    id:"w2q4", worldId:2,
    gen:()=>{ const s=rnd(6,16); const c=4*s;
      return {prompt:`A square field near Sheffield has side ${s} m. What is its perimeter?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`Since all 4 sides are equal: P = 4 × ${s}`}; }
  },
  {
    id:"w2q5", worldId:2,
    gen:()=>{ const s=rnd(3,12); const c=4*s;
      return {prompt:`A square chessboard in Stratford has a side of ${s} cm. What is the perimeter of the board?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`P = 4 × side = 4 × ${s}`}; }
  },
  {
    id:"w2q6", worldId:2,
    gen:()=>{ const s=rnd(7,19); const c=4*s;
      return {prompt:`A square playground in Glasgow has sides of ${s} m. Emma runs around it once. How far does she run?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`Distance = perimeter = 4 × ${s}`}; }
  },
  {
    id:"w2q7", worldId:2,
    gen:()=>{ const s=rnd(4,13); const c=4*s;
      return {prompt:`A square window in Newcastle has each side equal to ${s} cm. What is the total length of its frame?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`Frame length = perimeter of square = 4 × ${s}`}; }
  },
  {
    id:"w2q8", worldId:2,
    gen:()=>{ const s=rnd(5,17); const c=4*s;
      return {prompt:`A square mat in a Leeds school has each side of ${s} cm. What is the perimeter of the mat?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`P = 4 × ${s} = ${c} cm`}; }
  },
  {
    id:"w2q9", worldId:2,
    gen:()=>{ const s=rnd(8,20); const c=4*s;
      return {prompt:`A square swimming pool in Nottingham measures ${s} m on each side. What is the total distance around the pool?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`All four sides of a square are equal. P = 4 × ${s}`}; }
  },
  {
    id:"w2q10", worldId:2,
    gen:()=>{ const s=rnd(6,15); const c=4*s;
      return {prompt:`A square picture frame in an Exeter gallery has sides of ${s} cm. What length of gold edging is needed to go around it?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`Edging length = perimeter = 4 × ${s}`}; }
  },

  // ===== WORLD 3: Brick Yard (Grid-based perimeter) =====
  {
    id:"w3q1", worldId:3,
    gen:()=>{ const L=rnd(3,8), B=rnd(2,L); const c=2*(L+B);
      return {prompt:`A rectangle is drawn on a grid. It is ${L} units long and ${B} units wide. What is its perimeter in units?`,
        correct:c, params:{L,B}, diagramType:"grid", diagramData:{L,B},
        hint:`Count all the outside squares: top + right + bottom + left = ${L}+${B}+${L}+${B}`}; }
  },
  {
    id:"w3q2", worldId:3,
    gen:()=>{ const s=rnd(2,7); const c=4*s;
      return {prompt:`A square is drawn on a centimetre grid. Each side is ${s} cm. What is the perimeter?`,
        correct:c, params:{side:s}, diagramType:"grid", diagramData:{L:s,B:s},
        hint:`Count units along each side: ${s} + ${s} + ${s} + ${s}`}; }
  },
  {
    id:"w3q3", worldId:3,
    gen:()=>{ const L=rnd(4,9), B=rnd(2,L-1); const c=2*(L+B);
      return {prompt:`On a dot grid, a rectangle spans ${L} dots across and ${B} dots down (measure inside). What is the perimeter in units?`,
        correct:c, params:{L,B}, diagramType:"grid", diagramData:{L,B},
        hint:`P = 2 × (${L} + ${B})`}; }
  },
  {
    id:"w3q4", worldId:3,
    gen:()=>{ const L=rnd(5,10), B=rnd(2,L); const c=2*(L+B);
      return {prompt:`A shape drawn on a 1 cm grid has length ${L} cm and breadth ${B} cm. What is its perimeter?`,
        correct:c, params:{L,B}, diagramType:"grid", diagramData:{L,B},
        hint:`Trace the outer edge: 2 × (length + breadth)`}; }
  },
  {
    id:"w3q5", worldId:3,
    gen:()=>{ const L=rnd(3,8), B=rnd(2,5); const c=2*(L+B);
      return {prompt:`Jack draws a rectangle on grid paper. It covers ${L} squares across and ${B} squares down. What is the perimeter?`,
        correct:c, params:{L,B}, diagramType:"grid", diagramData:{L,B},
        hint:`Count all outer units: top(${L}) + side(${B}) + bottom(${L}) + side(${B})`}; }
  },
  {
    id:"w3q6", worldId:3,
    gen:()=>{ const s=rnd(3,8); const c=4*s;
      return {prompt:`Sophia shades a ${s} × ${s} square on her grid. What is the perimeter of the shaded region?`,
        correct:c, params:{side:s}, diagramType:"grid", diagramData:{L:s,B:s},
        hint:`Perimeter = 4 × ${s}`}; }
  },
  {
    id:"w3q7", worldId:3,
    gen:()=>{ const L=rnd(4,9), B=rnd(2,L-1); const c=2*(L+B);
      return {prompt:`A brick wall design is ${L} bricks wide and ${B} bricks tall on a grid (each brick = 1 unit). What is the perimeter of the design?`,
        correct:c, params:{L,B}, diagramType:"grid", diagramData:{L,B},
        hint:`2 × (${L} + ${B})`}; }
  },
  {
    id:"w3q8", worldId:3,
    gen:()=>{ const L=rnd(5,10), B=rnd(3,L); const c=2*(L+B);
      return {prompt:`On a cm grid, a rectangle is ${L} cm long and ${B} cm wide. What is its perimeter?`,
        correct:c, params:{L,B}, diagramType:"grid", diagramData:{L,B},
        hint:`P = L + B + L + B`}; }
  },
  {
    id:"w3q9", worldId:3,
    gen:()=>{ const s=rnd(4,9); const c=4*s;
      return {prompt:`A square is drawn with sides of ${s} grid units each. What is the total number of grid units around its boundary?`,
        correct:c, params:{side:s}, diagramType:"grid", diagramData:{L:s,B:s},
        hint:`Count each side: ${s} + ${s} + ${s} + ${s} = ?`}; }
  },
  {
    id:"w3q10", worldId:3,
    gen:()=>{ const L=rnd(6,10), B=rnd(3,L-1); const c=2*(L+B);
      return {prompt:`A rectangle on a centimetre grid is ${L} cm long and ${B} cm wide. What is the total boundary length?`,
        correct:c, params:{L,B}, diagramType:"grid", diagramData:{L,B},
        hint:`2 × (L + B) = 2 × (${L} + ${B})`}; }
  },

  // ===== WORLD 4: Kite Corner (Regular Polygons) =====
  {
    id:"w4q1", worldId:4,
    gen:()=>{ const s=rnd(3,12); const c=3*s;
      return {prompt:`An equilateral triangle in a kite design has each side measuring ${s} cm. What is its perimeter?`,
        correct:c, params:{side:s,n:3}, diagramType:"polygon", diagramData:{sides:3,sideLen:s},
        hint:`Equilateral triangle has 3 equal sides. P = 3 × ${s}`}; }
  },
  {
    id:"w4q2", worldId:4,
    gen:()=>{ const s=rnd(4,10); const c=5*s;
      return {prompt:`A regular pentagon kite frame has each side equal to ${s} cm. What is the total perimeter of the pentagon?`,
        correct:c, params:{side:s,n:5}, diagramType:"polygon", diagramData:{sides:5,sideLen:s},
        hint:`Regular pentagon has 5 equal sides. P = 5 × ${s}`}; }
  },
  {
    id:"w4q3", worldId:4,
    gen:()=>{ const s=rnd(3,9); const c=6*s;
      return {prompt:`A regular hexagon tile from Chester has each side ${s} cm long. What is its perimeter?`,
        correct:c, params:{side:s,n:6}, diagramType:"polygon", diagramData:{sides:6,sideLen:s},
        hint:`Regular hexagon has 6 equal sides. P = 6 × ${s}`}; }
  },
  {
    id:"w4q4", worldId:4,
    gen:()=>{ const s=rnd(4,14); const c=3*s;
      return {prompt:`Lily makes a triangular flag for a Durham fete. Each side is ${s} cm. What is the perimeter of the flag?`,
        correct:c, params:{side:s,n:3}, diagramType:"polygon", diagramData:{sides:3,sideLen:s},
        hint:`Triangle perimeter = 3 × side (when all sides are equal)`}; }
  },
  {
    id:"w4q5", worldId:4,
    gen:()=>{ const s=rnd(3,11); const c=5*s;
      return {prompt:`A regular pentagonal star center piece in Leicester has each side of ${s} cm. What is the perimeter?`,
        correct:c, params:{side:s,n:5}, diagramType:"polygon", diagramData:{sides:5,sideLen:s},
        hint:`5 equal sides: P = 5 × ${s}`}; }
  },
  {
    id:"w4q6", worldId:4,
    gen:()=>{ const s=rnd(5,12); const c=6*s;
      return {prompt:`A regular hexagonal placemat in a Norwich café has sides of ${s} cm. What is its perimeter?`,
        correct:c, params:{side:s,n:6}, diagramType:"polygon", diagramData:{sides:6,sideLen:s},
        hint:`6 equal sides: P = 6 × ${s}`}; }
  },
  {
    id:"w4q7", worldId:4,
    gen:()=>{ const s=rnd(4,13); const c=3*s;
      return {prompt:`A triangular sandwich in a Canterbury café has each side ${s} cm long. What is the total perimeter of the sandwich?`,
        correct:c, params:{side:s,n:3}, diagramType:"polygon", diagramData:{sides:3,sideLen:s},
        hint:`All three sides equal: P = 3 × ${s}`}; }
  },
  {
    id:"w4q8", worldId:4,
    gen:()=>{ const s=rnd(3,10); const c=4*s;
      return {prompt:`A regular rhombus pattern in a Coventry quilt has each side of ${s} cm. What is the perimeter?`,
        correct:c, params:{side:s,n:4}, diagramType:"polygon", diagramData:{sides:4,sideLen:s},
        hint:`4 equal sides: P = 4 × ${s}`}; }
  },
  {
    id:"w4q9", worldId:4,
    gen:()=>{ const s=rnd(5,11); const c=5*s;
      return {prompt:`In a Hereford market, a regular pentagonal sticker has each side ${s} cm. What is the perimeter?`,
        correct:c, params:{side:s,n:5}, diagramType:"polygon", diagramData:{sides:5,sideLen:s},
        hint:`Pentagon = 5 sides. P = 5 × ${s}`}; }
  },
  {
    id:"w4q10", worldId:4,
    gen:()=>{ const s=rnd(4,12); const c=6*s;
      return {prompt:`A regular hexagonal poster frame in a Winchester museum has sides of ${s} cm. What is its perimeter?`,
        correct:c, params:{side:s,n:6}, diagramType:"polygon", diagramData:{sides:6,sideLen:s},
        hint:`6 equal sides each ${s} cm. P = 6 × ${s}`}; }
  },

  // ===== WORLD 5: Picture Frame (Mixed word problems) =====
  {
    id:"w5q1", worldId:5,
    gen:()=>{ const L=rnd(8,20), B=rnd(5,L-1); const c=2*(L+B);
      return {prompt:`A rectangular photo frame in a Portsmouth gallery is ${L} cm long and ${B} cm wide. What length of decorative border is needed to go around it?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Border length = perimeter = 2 × (${L} + ${B})`}; }
  },
  {
    id:"w5q2", worldId:5,
    gen:()=>{ const s=rnd(6,18); const c=4*s;
      return {prompt:`A square photo frame in Plymouth has sides of ${s} cm. What is the total length of its edge?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`Square edge = 4 × ${s}`}; }
  },
  {
    id:"w5q3", worldId:5,
    gen:()=>{ const L=rnd(9,18), B=rnd(5,L-2); const c=2*(L+B);
      return {prompt:`A rectangular mirror in a Derby bathroom is ${L} cm long and ${B} cm wide. What is the perimeter of the mirror?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`2 × (L + B) = 2 × (${L} + ${B})`}; }
  },
  {
    id:"w5q4", worldId:5,
    gen:()=>{ const s=rnd(5,15); const c=4*s;
      return {prompt:`A square window frame in a Worcester cottage has each side equal to ${s} cm. What is the length of wood needed to frame it?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`P = 4 × ${s}`}; }
  },
  {
    id:"w5q5", worldId:5,
    gen:()=>{ const L=rnd(10,20), B=rnd(6,L-2); const c=2*(L+B);
      return {prompt:`A rectangular canvas in a Leicester art studio is ${L} cm long and ${B} cm wide. How much trim is needed around the edge?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Trim = perimeter = 2 × (${L} + ${B})`}; }
  },
  {
    id:"w5q6", worldId:5,
    gen:()=>{ const L=rnd(7,15), B=rnd(4,L-1); const c=2*(L+B);
      return {prompt:`Farmer Beth in Somerset wants to put a white border around a rectangular notice board that is ${L} cm long and ${B} cm wide. How long must the border be?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Border = P = 2 × (length + breadth)`}; }
  },
  {
    id:"w5q7", worldId:5,
    gen:()=>{ const s=rnd(7,17); const c=4*s;
      return {prompt:`A square quilting panel in a Shrewsbury craft fair has a side of ${s} cm. What is the total boundary of the panel?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`4 equal sides: P = 4 × ${s}`}; }
  },
  {
    id:"w5q8", worldId:5,
    gen:()=>{ const L=rnd(12,20), B=rnd(7,L-2); const c=2*(L+B);
      return {prompt:`A rectangular bookshelf in a Cheltenham library is ${L} cm wide and ${B} cm tall. What is the perimeter of the shelf's front face?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`2 × (${L} + ${B})`}; }
  },
  {
    id:"w5q9", worldId:5,
    gen:()=>{ const s=rnd(8,16); const c=4*s;
      return {prompt:`A square garden stone in Taunton has each side ${s} cm. What is the perimeter of the stone?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`4 × ${s} = ${c} cm`}; }
  },
  {
    id:"w5q10", worldId:5,
    gen:()=>{ const L=rnd(11,19), B=rnd(6,L-3); const c=2*(L+B);
      return {prompt:`A rectangular corkboard in a Truro school is ${L} cm long and ${B} cm wide. What length of ribbon is needed to decorate its border?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Ribbon = P = 2 × (${L} + ${B})`}; }
  },

  // ===== WORLD 6: L-Shape Lake (Composite figures) =====
  {
    id:"w6q1", worldId:6,
    gen:()=>{ const a=rnd(4,10), b=rnd(3,8), c2=rnd(2,b-1), d=rnd(2,a-1);
      // L-shape: outer rect a×b minus corner d×c2
      // sides: a, b, a-d, c2, d, b-c2
      const sides=[a, b, a-d, c2, d, b-c2];
      const correct=sides.reduce((s,v)=>s+v,0);
      return {prompt:`An L-shaped pond near Stratford has these outer measurements: ${a} m across, ${b} m tall, with a notch ${d} m wide and ${c2} m tall cut from one corner. What is the perimeter?`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d},
        hint:`Add all 6 sides: ${sides.join(' + ')} = ${correct} m`}; }
  },
  {
    id:"w6q2", worldId:6,
    gen:()=>{ const a=rnd(5,12), b=rnd(4,9), c2=rnd(2,b-1), d=rnd(2,a-2);
      const sides=[a, b, a-d, c2, d, b-c2];
      const correct=sides.reduce((s,v)=>s+v,0);
      return {prompt:`An L-shaped flower bed in a Warwickshire garden has outer length ${a} m and outer width ${b} m. A corner section ${d} m by ${c2} m is cut away. What is the perimeter of the flower bed?`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d},
        hint:`Count all 6 outer sides carefully.`}; }
  },
  {
    id:"w6q3", worldId:6,
    gen:()=>{ const a=rnd(6,14), b=rnd(5,10), c2=rnd(2,b-1), d=rnd(2,a-2);
      const sides=[a, b, a-d, c2, d, b-c2];
      const correct=sides.reduce((s,v)=>s+v,0);
      return {prompt:`An L-shaped patio in a Salisbury home measures ${a} m by ${b} m overall, with a rectangular corner of ${d} m by ${c2} m removed. What is the total perimeter?`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d},
        hint:`Add all 6 outer boundary lengths.`}; }
  },
  {
    id:"w6q4", worldId:6,
    gen:()=>{ const a=rnd(5,11), b=rnd(4,8), c2=rnd(2,b-1), d=rnd(2,a-2);
      const sides=[a, b, a-d, c2, d, b-c2];
      const correct=sides.reduce((s,v)=>s+v,0);
      return {prompt:`A rectilinear shape in Gloucester has 6 sides: ${sides[0]} m, ${sides[1]} m, ${sides[2]} m, ${sides[3]} m, ${sides[4]} m, and ${sides[5]} m. What is its perimeter?`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d},
        hint:`Just add all six given sides together!`}; }
  },
  {
    id:"w6q5", worldId:6,
    gen:()=>{ const a=rnd(7,13), b=rnd(5,10), c2=rnd(2,b-2), d=rnd(3,a-3);
      const sides=[a, b, a-d, c2, d, b-c2];
      const correct=sides.reduce((s,v)=>s+v,0);
      return {prompt:`An L-shaped hall in a Reading museum is ${a} m long and ${b} m wide. A corner room of ${d} m × ${c2} m is inside. What is the perimeter of the hall's outer boundary?`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d},
        hint:`Outer perimeter has 6 sides. Add them all.`}; }
  },
  {
    id:"w6q6", worldId:6,
    gen:()=>{ const a=rnd(6,12), b=rnd(5,9), c2=rnd(2,b-1), d=rnd(2,a-2);
      const sides=[a, b, a-d, c2, d, b-c2];
      const correct=sides.reduce((s,v)=>s+v,0);
      return {prompt:`An L-shaped sandpit in an Ipswich park has outer size ${a} cm by ${b} cm with a corner ${d} cm by ${c2} cm removed. What is the perimeter of the sandpit?`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d},
        hint:`Identify all 6 outer sides and add them.`}; }
  },
  {
    id:"w6q7", worldId:6,
    gen:()=>{ const a=rnd(8,15), b=rnd(6,11), c2=rnd(2,b-2), d=rnd(3,a-3);
      const sides=[a, b, a-d, c2, d, b-c2];
      const correct=sides.reduce((s,v)=>s+v,0);
      return {prompt:`An L-shaped classroom in a Colchester school has outer dimensions ${a} m × ${b} m with a ${d} m × ${c2} m section cut from one corner. Find the perimeter.`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d},
        hint:`6 sides total. Add each outer length.`}; }
  },
  {
    id:"w6q8", worldId:6,
    gen:()=>{ const a=rnd(5,10), b=rnd(4,8), c2=rnd(2,b-1), d=rnd(2,a-2);
      const sides=[a, b, a-d, c2, d, b-c2];
      const correct=sides.reduce((s,v)=>s+v,0);
      return {prompt:`An L-shaped pond in a Norwich garden has 6 sides. The known sides are ${sides[0]}, ${sides[1]}, ${sides[2]}, ${sides[3]}, ${sides[4]}, ${sides[5]} (all in metres). What is the total perimeter?`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d},
        hint:`Sum all 6 given values.`}; }
  },
  {
    id:"w6q9", worldId:6,
    gen:()=>{ const a=rnd(9,14), b=rnd(6,11), c2=rnd(3,b-2), d=rnd(3,a-3);
      const sides=[a, b, a-d, c2, d, b-c2];
      const correct=sides.reduce((s,v)=>s+v,0);
      return {prompt:`An L-shaped kitchen in a Peterborough home has the layout: ${a} m wide, ${b} m tall, with a ${d} m × ${c2} m corner alcove. Find the full perimeter.`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d},
        hint:`Draw it out and label all 6 sides.`}; }
  },
  {
    id:"w6q10", worldId:6,
    gen:()=>{ const a=rnd(7,12), b=rnd(5,9), c2=rnd(2,b-1), d=rnd(2,a-2);
      const sides=[a, b, a-d, c2, d, b-c2];
      const correct=sides.reduce((s,v)=>s+v,0);
      return {prompt:`An L-shaped stage area in an Ely school hall is ${a} m by ${b} m overall, with a corner removed (${d} m × ${c2} m). What is the perimeter?`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d},
        hint:`Composite shape: add all outer sides.`}; }
  },

  // ===== WORLD 7: Pet Pen (Missing side inference) =====
  {
    id:"w7q1", worldId:7,
    gen:()=>{ const L=rnd(8,16), B=rnd(4,L-2); const c=2*(L+B);
      return {prompt:`A rectangular pet pen in a Swindon farm has perimeter ${c} m. One side is ${L} m long. What is the length of the adjacent side?`,
        correct:B, params:{L,perimeter:c}, diagramType:"rectangle", diagramData:{L,B,missingB:true},
        hint:`P = 2×(L+B). So B = (P÷2) − L = (${c}÷2) − ${L}`}; }
  },
  {
    id:"w7q2", worldId:7,
    gen:()=>{ const a=rnd(5,12), b=rnd(4,9), c2=rnd(2,b-1), d=rnd(2,a-2);
      const sides=[a, b, a-d, c2, d, b-c2];
      const correct=b-c2; // missing side
      const knownSum = sides.reduce((s,v)=>s+v,0) - correct;
      return {prompt:`An L-shaped pet pen in Oxford has 5 sides known: ${a} m, ${b} m, ${a-d} m, ${c2} m, ${d} m. What is the missing 6th side?`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d,missingSide:5},
        hint:`Opposite sides must match: missing side = ${b} − ${c2}`}; }
  },
  {
    id:"w7q3", worldId:7,
    gen:()=>{ const L=rnd(7,15), B=rnd(3,L-2); const c=2*(L+B);
      return {prompt:`A rectangular rabbit hutch run in Bournemouth has a perimeter of ${c} cm and a length of ${L} cm. What is the breadth?`,
        correct:B, params:{L,perimeter:c}, diagramType:"rectangle", diagramData:{L,B,missingB:true},
        hint:`B = P÷2 − L = ${c}÷2 − ${L}`}; }
  },
  {
    id:"w7q4", worldId:7,
    gen:()=>{ const a=rnd(6,13), b=rnd(5,10), c2=rnd(2,b-1), d=rnd(2,a-2);
      const correct=a-d;
      return {prompt:`An L-shaped dog run in Swansea has sides: ${a} m (bottom), ${b} m (left), [?] m (top-partial), ${c2} m (step), ${d} m (step), ${b-c2} m (right). What is the missing side?`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d,missingSide:2},
        hint:`Top partial side = total bottom − step = ${a} − ${d}`}; }
  },
  {
    id:"w7q5", worldId:7,
    gen:()=>{ const L=rnd(9,18), B=rnd(5,L-3); const c=2*(L+B);
      return {prompt:`A rectangular horse paddock in Hereford has perimeter ${c} m and breadth ${B} m. What is the length?`,
        correct:L, params:{B,perimeter:c}, diagramType:"rectangle", diagramData:{L,B,missingL:true},
        hint:`L = P÷2 − B = ${c}÷2 − ${B}`}; }
  },
  {
    id:"w7q6", worldId:7,
    gen:()=>{ const a=rnd(5,11), b=rnd(4,8), c2=rnd(2,b-1), d=rnd(2,a-2);
      const correct=b-c2;
      return {prompt:`A cat enclosure in Exeter has an L-shape. The left full side is ${b} m. A notch cuts in ${c2} m on the right-top. What is the shorter right-side length?`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d,missingSide:5},
        hint:`Short right side = full left − notch depth = ${b} − ${c2}`}; }
  },
  {
    id:"w7q7", worldId:7,
    gen:()=>{ const L=rnd(8,16), B=rnd(4,L-2); const c=2*(L+B);
      return {prompt:`A rectangular fish pond in Carlisle has perimeter ${c} m. The breadth is ${B} m. Find the length.`,
        correct:L, params:{B,perimeter:c}, diagramType:"rectangle", diagramData:{L,B,missingL:true},
        hint:`Length = (Perimeter ÷ 2) − Breadth`}; }
  },
  {
    id:"w7q8", worldId:7,
    gen:()=>{ const a=rnd(7,13), b=rnd(5,9), c2=rnd(3,b-2), d=rnd(3,a-3);
      const correct=a-d;
      return {prompt:`An L-shaped aviary near Durham has these sides: [?], ${b}, ${a-d} wait — actually [?] m on top, ${b} m left, ${d} m step right, ${c2} m step up, then ${a-d} … Hmm, the top side is missing. The full base is ${a} m and the step extends ${d} m inward. What is the missing top side?`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d,missingSide:0},
        hint:`Missing top = full base − inward step = ${a} − ${d}`}; }
  },
  {
    id:"w7q9", worldId:7,
    gen:()=>{ const L=rnd(10,18), B=rnd(5,L-4); const c=2*(L+B);
      return {prompt:`A rectangular guinea pig run in Halifax has perimeter ${c} cm. Its length is ${L} cm. What is its breadth?`,
        correct:B, params:{L,perimeter:c}, diagramType:"rectangle", diagramData:{L,B,missingB:true},
        hint:`Breadth = (${c} ÷ 2) − ${L}`}; }
  },
  {
    id:"w7q10", worldId:7,
    gen:()=>{ const a=rnd(6,12), b=rnd(4,8), c2=rnd(2,b-1), d=rnd(2,a-2);
      const correct=b-c2;
      return {prompt:`An L-shaped turtle enclosure in Brighton has: base ${a} m, full height ${b} m, top-partial ${a-d} m, inner step-up ${c2} m, inner step-in ${d} m. What is the missing short-height side?`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d,missingSide:5},
        hint:`Short height = full height − inner step = ${b} − ${c2}`}; }
  },

  // ===== WORLD 8: Measure Mansion (Real-world cm/m contexts) =====
  {
    id:"w8q1", worldId:8,
    gen:()=>{ const L=rnd(5,15), B=rnd(3,L-1); const c=2*(L+B);
      return {prompt:`A rectangular room in a Mansion in Suffolk is ${L} m long and ${B} m wide. What is the perimeter of the room's floor?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`P = 2 × (${L} + ${B}) metres`}; }
  },
  {
    id:"w8q2", worldId:8,
    gen:()=>{ const s=rnd(5,16); const c=4*s;
      return {prompt:`A square dining table in a Hampshire manor house has sides of ${s} cm. What is the perimeter of the tabletop in centimetres?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`P = 4 × ${s} cm`}; }
  },
  {
    id:"w8q3", worldId:8,
    gen:()=>{ const L=rnd(8,20), B=rnd(4,L-2); const c=2*(L+B);
      return {prompt:`The ballroom of a Kent mansion is ${L} m long and ${B} m wide. How much skirting board (in metres) is needed to go around the entire room?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Skirting board length = perimeter of room = 2 × (${L} + ${B})`}; }
  },
  {
    id:"w8q4", worldId:8,
    gen:()=>{ const L=rnd(6,18), B=rnd(4,L-2); const c=2*(L+B);
      return {prompt:`A rectangular carpet in a Surrey mansion is ${L} cm long and ${B} cm wide. What is the length of carpet edging needed?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Edging = perimeter = 2 × (${L} + ${B})`}; }
  },
  {
    id:"w8q5", worldId:8,
    gen:()=>{ const s=rnd(7,18); const c=4*s;
      return {prompt:`A square courtyard in an Essex manor is ${s} m on each side. What is the total perimeter in metres?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`4 × ${s} = ${c} m`}; }
  },
  {
    id:"w8q6", worldId:8,
    gen:()=>{ const L=rnd(9,19), B=rnd(5,L-3); const c=2*(L+B);
      return {prompt:`A rectangular lawn in a Dorset country house is ${L} m long and ${B} m wide. What length of edging is needed to go all the way around?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Lawn edging = perimeter = 2 × (${L} + ${B})`}; }
  },
  {
    id:"w8q7", worldId:8,
    gen:()=>{ const s=rnd(6,14); const c=4*s;
      return {prompt:`A square ornamental pond in a Wiltshire estate is ${s} m wide. A gardener walks once around the edge. How far does she walk?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`Distance = perimeter = 4 × ${s}`}; }
  },
  {
    id:"w8q8", worldId:8,
    gen:()=>{ const L=rnd(10,18), B=rnd(6,L-2); const c=2*(L+B);
      return {prompt:`A rectangular greenhouse in a Hertfordshire garden is ${L} m long and ${B} m wide. What length of weather stripping is needed for its entire base perimeter?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`P = 2 × (${L} + ${B})`}; }
  },
  {
    id:"w8q9", worldId:8,
    gen:()=>{ const s=rnd(8,15); const c=4*s;
      return {prompt:`A square sandstone paving slab in a Berkshire garden is ${s} cm wide. What is the perimeter of the slab?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`All four sides equal ${s} cm. P = 4 × ${s}`}; }
  },
  {
    id:"w8q10", worldId:8,
    gen:()=>{ const L=rnd(11,20), B=rnd(7,L-3); const c=2*(L+B);
      return {prompt:`A rectangular swimming pool in an Oxfordshire manor is ${L} m long and ${B} m wide. What is the perimeter of the pool?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Pool perimeter = 2 × (${L} + ${B})`}; }
  },

  // ===== WORLD 9: Shape Carnival (Two-step word problems) =====
  {
    id:"w9q1", worldId:9,
    gen:()=>{ const L=rnd(6,14), B=rnd(3,L-2); const p1=2*(L+B); const s=rnd(3,8); const p2=4*s;
      return {prompt:`At a carnival in Norwich, a rectangular stall is ${L} m by ${B} m and a square prize booth has side ${s} m. What is the combined total perimeter of BOTH shapes?`,
        correct:p1+p2, params:{L,B,s}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Rectangle P = 2×(${L}+${B}) = ${p1}. Square P = 4×${s} = ${p2}. Total = ${p1}+${p2}`}; }
  },
  {
    id:"w9q2", worldId:9,
    gen:()=>{ const L=rnd(8,16), B=rnd(4,L-2); const p=2*(L+B); const extra=rnd(2,8);
      return {prompt:`A rectangular field in Winchester is ${L} m by ${B} m. Harry runs around it twice and then runs an extra ${extra} m straight. How far does Harry run in total?`,
        correct:2*p+extra, params:{L,B,extra}, diagramType:"rectangle", diagramData:{L,B},
        hint:`One lap = perimeter = ${p} m. Two laps = ${2*p} m. Plus ${extra} m extra = ${2*p+extra} m`}; }
  },
  {
    id:"w9q3", worldId:9,
    gen:()=>{ const s1=rnd(4,10), s2=rnd(3,8);
      return {prompt:`Two square carnival stalls in a Salisbury fair have sides of ${s1} cm and ${s2} cm. What is the difference between their perimeters?`,
        correct:4*Math.abs(s1-s2), params:{s1,s2}, diagramType:"square", diagramData:{side:s1},
        hint:`P1 = 4×${s1} = ${4*s1}. P2 = 4×${s2} = ${4*s2}. Difference = |${4*s1}−${4*s2}|`}; }
  },
  {
    id:"w9q4", worldId:9,
    gen:()=>{ const L=rnd(7,15), B=rnd(4,L-2); const p=2*(L+B); const n=rnd(2,4);
      return {prompt:`A rectangular carnival ring in Eastbourne is ${L} m by ${B} m. A performer walks around it ${n} times. How far does the performer walk?`,
        correct:n*p, params:{L,B,n}, diagramType:"rectangle", diagramData:{L,B},
        hint:`One circuit = ${p} m. ${n} circuits = ${n} × ${p}`}; }
  },
  {
    id:"w9q5", worldId:9,
    gen:()=>{ const s=rnd(5,12), n=rnd(2,4);
      return {prompt:`A square dance floor at a Somerset carnival has side ${s} m. A dancer prances around it ${n} times. What is the total distance danced?`,
        correct:n*4*s, params:{s,n}, diagramType:"square", diagramData:{side:s},
        hint:`One lap = 4×${s} = ${4*s} m. ${n} laps = ${n}×${4*s}`}; }
  },
  {
    id:"w9q6", worldId:9,
    gen:()=>{ const L1=rnd(6,13), B1=rnd(3,L1-2), L2=rnd(5,12), B2=rnd(3,L2-2);
      const p1=2*(L1+B1), p2=2*(L2+B2);
      return {prompt:`Two rectangular carnival booths in Derby have dimensions ${L1} m×${B1} m and ${L2} m×${B2} m. What is the total perimeter of both booths combined?`,
        correct:p1+p2, params:{L1,B1,L2,B2}, diagramType:"rectangle", diagramData:{L:L1,B:B1},
        hint:`P1=2×(${L1}+${B1})=${p1}. P2=2×(${L2}+${B2})=${p2}. Total=${p1+p2}`}; }
  },
  {
    id:"w9q7", worldId:9,
    gen:()=>{ const L=rnd(8,14), B=rnd(4,L-2); const p=2*(L+B); const less=rnd(2,6);
      return {prompt:`A rectangular marquee in a Gloucester fair is ${L} m by ${B} m. The new marquee next year will have a perimeter ${less} m less. What will the new perimeter be?`,
        correct:p-less, params:{L,B,less}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Old P = 2×(${L}+${B}) = ${p}. New P = ${p} − ${less}`}; }
  },
  {
    id:"w9q8", worldId:9,
    gen:()=>{ const s=rnd(4,11), n=rnd(3,5);
      return {prompt:`At a Cheltenham carnival, ${n} identical square signs each have side ${s} cm. If placed end-to-end in a line, what is the total perimeter of ALL the individual signs combined?`,
        correct:n*4*s, params:{s,n}, diagramType:"square", diagramData:{side:s},
        hint:`Each sign: P = 4×${s}. For ${n} signs: ${n}×4×${s}`}; }
  },
  {
    id:"w9q9", worldId:9,
    gen:()=>{ const L=rnd(9,16), B=rnd(5,L-3); const p=2*(L+B); const more=rnd(4,12);
      return {prompt:`A rectangular stage in a York festival is ${L} m by ${B} m. Next year the perimeter will be ${more} m more. What will be the new perimeter?`,
        correct:p+more, params:{L,B,more}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Old P = ${p}. New P = ${p} + ${more}`}; }
  },
  {
    id:"w9q10", worldId:9,
    gen:()=>{ const s1=rnd(5,10), s2=rnd(3,8); const L=rnd(7,14), B=rnd(4,L-2);
      const total=4*s1+4*s2+2*(L+B);
      return {prompt:`Three shapes at a Bristol carnival: two squares with sides ${s1} cm and ${s2} cm, and a rectangle ${L} cm by ${B} cm. What is the grand total of all three perimeters?`,
        correct:total, params:{s1,s2,L,B}, diagramType:"square", diagramData:{side:s1},
        hint:`P1=4×${s1}=${4*s1}. P2=4×${s2}=${4*s2}. P3=2×(${L}+${B})=${2*(L+B)}. Total?`}; }
  },

  // ===== WORLD 10: Quest Castle (Boss level mixed mastery) =====
  {
    id:"w10q1", worldId:10,
    gen:()=>{ const L=rnd(9,20), B=rnd(5,L-3); const c=2*(L+B);
      return {prompt:`A royal rectangular courtyard at Pembroke Castle is ${L} m long and ${B} m wide. The king orders a gold railing all around it. How much railing is needed?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Railing = P = 2×(${L}+${B})`}; }
  },
  {
    id:"w10q2", worldId:10,
    gen:()=>{ const s=rnd(8,20); const c=4*s;
      return {prompt:`A perfect square tower room at Windsor Castle has walls each ${s} m long. What is the total perimeter of the room?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`P = 4×${s}`}; }
  },
  {
    id:"w10q3", worldId:10,
    gen:()=>{ const a=rnd(6,14), b=rnd(5,10), c2=rnd(2,b-1), d=rnd(2,a-2);
      const sides=[a, b, a-d, c2, d, b-c2];
      const correct=sides.reduce((s,v)=>s+v,0);
      return {prompt:`An L-shaped throne room at a castle near Windsor has 6 sides. Given measurements: ${sides.join(', ')} metres. What is the full perimeter?`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d},
        hint:`Add all six: ${sides.join('+')}`}; }
  },
  {
    id:"w10q4", worldId:10,
    gen:()=>{ const s=rnd(5,12); const c=6*s;
      return {prompt:`A regular hexagonal banquet table at Caernarfon Castle has sides of ${s} m each. What is the perimeter of the table?`,
        correct:c, params:{side:s,n:6}, diagramType:"polygon", diagramData:{sides:6,sideLen:s},
        hint:`6 equal sides: P = 6×${s}`}; }
  },
  {
    id:"w10q5", worldId:10,
    gen:()=>{ const L=rnd(10,18), B=rnd(6,L-3); const p=2*(L+B); const n=rnd(2,3);
      return {prompt:`A guard marches around a rectangular parade ground at Stirling Castle (${L} m by ${B} m) exactly ${n} times. How far does the guard march in total?`,
        correct:n*p, params:{L,B,n}, diagramType:"rectangle", diagramData:{L,B},
        hint:`One round = P = ${p} m. ${n} rounds = ${n}×${p}`}; }
  },
  {
    id:"w10q6", worldId:10,
    gen:()=>{ const L=rnd(8,16), B=rnd(5,L-2); const c=2*(L+B);
      return {prompt:`Prince Edward wants to add a moat around a rectangular castle hall in Edinburgh that is ${L} m long and ${B} m wide. How many metres of moat edge (perimeter) must be dug?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`Moat length = perimeter = 2×(${L}+${B})`}; }
  },
  {
    id:"w10q7", worldId:10,
    gen:()=>{ const s=rnd(7,15); const c=3*s;
      return {prompt:`A triangular castle tower cross-section near Carlisle has all sides equal to ${s} m. What is the perimeter of the triangular base?`,
        correct:c, params:{side:s,n:3}, diagramType:"polygon", diagramData:{sides:3,sideLen:s},
        hint:`Equilateral triangle: P = 3×${s}`}; }
  },
  {
    id:"w10q8", worldId:10,
    gen:()=>{ const a=rnd(7,13), b=rnd(5,9), c2=rnd(2,b-1), d=rnd(2,a-2);
      const sides=[a,b,a-d,c2,d,b-c2];
      const correct=sides.reduce((s,v)=>s+v,0);
      return {prompt:`An L-shaped dungeon in a Yorkshire castle measures: full width ${a} m, full height ${b} m, inner step-width ${d} m, inner step-height ${c2} m. What is the outer perimeter?`,
        correct, params:{a,b,c:c2,d}, diagramType:"composite", diagramData:{a,b,c:c2,d},
        hint:`Work out all 6 sides then add them together.`}; }
  },
  {
    id:"w10q9", worldId:10,
    gen:()=>{ const L=rnd(12,20), B=rnd(7,L-4); const c=2*(L+B);
      return {prompt:`A grand rectangular ballroom in a Cornish castle is ${L} m long and ${B} m wide. What is its perimeter?`,
        correct:c, params:{L,B}, diagramType:"rectangle", diagramData:{L,B},
        hint:`P = 2×(L+B)`}; }
  },
  {
    id:"w10q10", worldId:10,
    gen:()=>{ const s=rnd(9,18); const c=4*s;
      return {prompt:`The legendary square Quest Arena at Castle Kiro has sides of ${s} m each. A knight gallops all the way around it. How far does the knight gallop?`,
        correct:c, params:{side:s}, diagramType:"square", diagramData:{side:s},
        hint:`Distance = perimeter = 4×${s}`}; }
  },
];

// Generate a world set: returns array of 10 question instances
export function generateWorldSet(worldId) {
  const worldTemplates = templates.filter(t => t.worldId === worldId);
  return worldTemplates.map(template => {
    setSeed(template.id);
    const result = template.gen();
    let { prompt, correct, params, diagramType, diagramData, hint } = result;
    // Ensure correct answer is a positive integer
    correct = Math.max(1, Math.round(correct));
    // Build distractors
    const distractors = makeDistractors(correct, params, diagramType);
    // Pad distractors if needed
    while (distractors.length < 3) {
      const offset = (distractors.length + 1) * 3;
      const candidate = correct + offset;
      if (!distractors.includes(candidate) && candidate !== correct) {
        distractors.push(candidate);
      } else {
        distractors.push(correct - (distractors.length + 1) * 2 > 0
          ? correct - (distractors.length + 1) * 2
          : correct + (distractors.length + 1) * 5);
      }
    }
    const options = shuffle([correct, ...distractors.slice(0, 3)]);
    return {
      templateId: template.id,
      prompt,
      correct,
      options,
      diagramType,
      diagramData,
      hint,
      params
    };
  });
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
