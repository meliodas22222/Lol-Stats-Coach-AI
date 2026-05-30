import { useState, useEffect, useRef } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);
  const [showGame, setShowGame] = useState(false);

  const cerca = async () => {
    const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
    setData(await res.json());
  };

  if (showGame) return <Game onClose={() => setShowGame(false)} />;

  return (
    <div style={{ padding: '20px', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={cerca}>Cerca</button>
      <button onClick={() => setShowGame(true)} style={{ marginLeft: '10px', background: 'gold' }}>🎮 Start Dodge Game</button>

      {data && data.stats && (
        <div style={{ marginTop: '20px' }}>
          <h2>{data.gameName} | {data.rank}</h2>
          {data.stats.map((m, i) => (
            <details key={i} style={{ background: '#1a1a1a', padding: '10px', margin: '5px 0', borderLeft: `5px solid ${m.win ? 'green' : 'red'}` }}>
              <summary>{m.champion} | {m.win ? 'WIN' : 'LOSS'}</summary>
              <p>KDA: {m.kills}/{m.deaths}/{m.assists} | Vision: {m.visionScore}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

function Game({ onClose }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    let p = { x: 400, y: 300, tx: 400, ty: 300 };
    let bullets = [];
    
    window.onmousedown = (e) => { p.tx = e.clientX; p.ty = e.clientY; };
    window.onkeydown = (e) => {
      if(e.code === 'Space') { p.x = p.tx; p.y = p.ty; }
    };

    const loop = setInterval(() => {
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(0, 0, 800, 600);
      // Giocatore
      p.x += (p.tx - p.x) * 0.1; p.y += (p.ty - p.y) * 0.1;
      ctx.fillStyle = 'cyan'; ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI*2); ctx.fill();
      // Nemici che sparano
      if(Math.random() < 0.05) bullets.push({x: Math.random()*800, y: 0, vx: (p.x - 400)/50, vy: 5});
      bullets.forEach((b, i) => {
        b.x += b.vx; b.y += b.vy;
        ctx.fillStyle = 'red'; ctx.fillRect(b.x, b.y, 10, 10);
        if(Math.hypot(p.x-b.x, p.y-b.y) < 20) { ctx.fillStyle='white'; ctx.fillText("HIT!", 400, 300); }
      });
    }, 30);
    return () => clearInterval(loop);
  }, []);
  return <div style={{position:'fixed', top:0, left:0, background:'#000'}}><button onClick={onClose}>EXIT</button><canvas ref={canvasRef} width={800} height={600}/></div>;
}
