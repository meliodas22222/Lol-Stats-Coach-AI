import { useState, useRef, useEffect } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);
  const [showGame, setShowGame] = useState(false);

  const cerca = async () => {
    const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
    const json = await res.json();
    setData(json);
  };

  if (showGame) return <Game onClose={() => setShowGame(false)} />;

  return (
    <div style={{ padding: '20px', backgroundColor: '#050505', color: '#cdbe91', fontFamily: 'sans-serif', minHeight: '100vh' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={cerca}>Cerca</button>
      <button onClick={() => setShowGame(true)} style={{ marginLeft: '10px' }}>🎮 Mini-Game</button>

      {data && data.stats && (
        <div style={{ marginTop: '20px' }}>
          <h2>{data.gameName} | {data.rank} {data.division}</h2>
          {data.stats.map((m, i) => (
            <div key={i} style={{ 
              background: '#1a1a1a', padding: '15px', margin: '10px 0', 
              borderLeft: `6px solid ${m.win ? '#28a745' : '#dc3545'}` 
            }}>
              <strong style={{ fontSize: '1.2em' }}>{m.champion}</strong>
              <p>KDA: {m.kills}/{m.deaths}/{m.assists} | <strong>Ratio: {m.kda}</strong></p>
              <p>Vision Score: {m.visionScore}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// (La funzione Game resta invariata come concordato)
