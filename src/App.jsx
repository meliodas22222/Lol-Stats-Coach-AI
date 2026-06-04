import { useState, useRef, useEffect } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);
  const [showGame, setShowGame] = useState(false);

  const cerca = async () => {
    try {
      const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
      const json = await res.json();
      if (json.error) alert(json.error);
      else setData(json);
    } catch (err) { console.error(err); }
  };

  if (showGame) return <Game onClose={() => setShowGame(false)} />;

  return (
    <div style={{ padding: '20px', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={cerca}>Cerca</button>
      <button onClick={() => setShowGame(true)} style={{ marginLeft: '10px', background: 'gold' }}>🎮 Game</button>

      {data && data.stats && (
        <div style={{ marginTop: '20px' }}>
          <h2>{data.gameName} | {data.rank} {data.division}</h2>
          {data.stats.map((m, i) => {
            if (!m) return null; // Protezione extra
            return (
              <div key={i} style={{ background: '#1a1a1a', padding: '10px', margin: '5px 0', borderLeft: `5px solid ${m.win ? 'green' : 'red'}` }}>
                <strong>{m.champion}</strong> | {m.win ? 'WIN' : 'LOSS'}
                <p>KDA: {m.kills}/{m.deaths}/{m.assists} | Vision: {m.visionScore}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Game({ onClose }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let p = { x: 400, y: 300, tx: 400, ty: 300 };
    let bullets = [];
    
    const handleMouse = (e) => { 
        const rect = canvas.getBoundingClientRect();
        p.tx = e.clientX - rect.left; 
        p.ty = e.clientY - rect.top; 
    };
    window.addEventListener('mousemove', handleMouse);

    const loop = setInterval(() => {
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(0, 0, 800, 600);
      p.x += (p.tx - p.x) * 0.1; p.y += (p.ty - p.y) * 0.1;
      ctx.fillStyle = 'cyan'; ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI*2); ctx.fill();
      
      if(Math.random() < 0.05) bullets.push({x: Math.random()*800, y: 0, vx: (p.x - 400)/50, vy: 5});
      bullets.forEach((b, i) => {
        b.x += b.vx; b.y += b.vy;
        ctx.fillStyle = 'red'; ctx.fillRect(b.x, b.y, 10, 10);
      });
    }, 30);
    return () => { clearInterval(loop); window.removeEventListener('mousemove', handleMouse); };
  }, []);
  return <div style={{position:'fixed', top:0, left:0, background:'#000', zIndex: 999}}><button onClick={onClose}>EXIT</button><canvas ref={canvasRef} width={800} height={600}/></div>;
}
