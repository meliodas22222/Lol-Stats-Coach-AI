import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);

  const cerca = async () => {
    try {
      const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Errore nel recupero dati:", err);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#050505', color: '#cdbe91', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={cerca}>Cerca</button>

      {data?.matches && (
        <div style={{ marginTop: '20px' }}>
          <h2>
            {data.gameName} | 
            <span style={{ color: '#d4af37', marginLeft: '10px' }}>
              {data.rank} {data.division} {data.lp}
            </span>
          </h2>
          {data.matches.map((m, i) => (
            <details key={i} style={{ background: '#1a1a1a', margin: '10px 0', padding: '10px', borderLeft: `6px solid ${m.win ? 'green' : 'red'}` }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                {m.champion} | {m.win ? 'WIN' : 'LOSS'} | {m.kills}/{m.deaths}/{m.assists} | Danno: {m.damage} | {m.duration} min
              </summary>
              <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {m.allPlayers?.map((p, idx) => (
                  <div key={idx} style={{ fontSize: '0.85em', color: p.team === 100 ? '#8888ff' : '#ff8888' }}>
                    {p.champ} ({p.name}) - KDA: {p.kda}
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
