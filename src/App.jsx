import { useState, useEffect, useRef } from 'react';

export default function App() {
  const [showGame, setShowGame] = useState(false);
  // ... (manteniamo le funzioni cerca, getChampWinrate etc. come nel codice precedente)

  return (
    <div style={{ padding: '20px', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      {!showGame ? (
        <>
          <h1>LoL Stats Coach AI</h1>
          {/* ... (Tutto il codice della dashboard precedente) ... */}
          <button onClick={() => setShowGame(true)} style={{ marginTop: '20px', padding: '10px', background: 'gold' }}>
            🎮 Apri Minigioco Skillshot
          </button>
        </>
      ) : (
        <SkillshotGame onClose={() => setShowGame(false)} />
      )}
    </div>
  );
}

// IL MINIGIOCO
function SkillshotGame({ onClose }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let player = { x: 400, y: 300, size: 20 };
    let projectiles = [{ x: 0, y: Math.random() * 600, speed: 5 }];

    const loop = setInterval(() => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, 800, 600);
      
      // Draw Player
      ctx.fillStyle = 'lime';
      ctx.fillRect(player.x, player.y, player.size, player.size);
      
      // Projectiles
      projectiles.forEach(p => {
        p.x += p.speed;
        ctx.fillStyle = 'red';
        ctx.fillRect(p.x, p.y, 10, 10);
        // Collision check...
      });
    }, 1000 / 60);

    return () => clearInterval(loop);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'black' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10 }}>Chiudi</button>
      <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid white' }} />
    </div>
  );
}
