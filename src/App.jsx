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
      <button onClick={() => setShowGame(true)} style={{ marginLeft: '10px', background: 'gold' }}>🎮 Allenati (Skillshot)</button>

      {data && (
        <div style={{ marginTop: '20px' }}>
          <h2>📊 {data.gameName} | {data.rank} ({data.lp} LP) | Winrate: {((data.wins/(data.wins+data.losses))*100).toFixed(0)}%</h2>
          {data.stats.map((m, i) => (
            <details key={i} style={{ background: '#1a1a1a', margin: '8px 0', padding: '10px', borderLeft: `5px solid ${m.win ? 'green' : 'red'}` }}>
              <summary style={{ cursor: 'pointer' }}>{m.champion} | {m.win ? 'V' : 'S'}</summary>
              <div style={{ fontSize: '0.9em' }}>
                <p>KDA: {m.kills}/{m.deaths}/{m.assists} | CS/m: {m.csPerMin} | Vision: {m.visionScore}</p>
                <strong>Altri giocatori:</strong> {(m.others || []).map((p, x) => <div key={x}>{p.name} ({p.champion}): {p.kda}</div>)}
              </div>
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
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    let p = { x: 400, y: 300, tx: 400, ty: 300 };
    let enemies = [{ x: 100, y: 100, hp: 3 }];
    let q = [];

    window.onmousedown = (e) => { p.tx = e.clientX; p.ty = e.clientY; };
    window.onkeydown = (e) => {
        if(e.key === 'q') q.push({ x: p.x, y: p.y, targetX: p.tx, targetY: p.ty });
        if(e.code === 'Space') { p.x += (Math.random()-0.5)*200; p.y += (Math.random()-0.5)*200; }
    };

    const loop = setInterval(() => {
      ctx.fillStyle = 'black'; ctx.fillRect(0, 0, 800, 600);
      p.x += (p.tx - p.x) * 0.05; p.y += (p.ty - p.y) * 0.05;
      ctx.fillStyle = 'lime'; ctx.fillRect(p.x, p.y, 20, 20);
      enemies.forEach(e => {
        ctx.fillStyle = 'red'; ctx.fillRect(e.x, e.y, 30, 30);
      });
      q.forEach((shot, i) => {
        shot.x += 5; ctx.fillStyle = 'yellow'; ctx.fillRect(shot.x, shot.y, 10, 5);
      });
    }, 30);
    return () => clearInterval(loop);
  }, []);

  return <div style={{ position: 'fixed', top:0, left:0, background: '#000' }}>
    <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10 }}>ESC</button>
    <canvas ref={canvasRef} width={800} height={600} />
  </div>;
}
