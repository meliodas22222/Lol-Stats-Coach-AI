import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);

  const cerca = async () => {
    const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
    const json = await res.json();
    setData(json);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'Arial' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={cerca}>Cerca</button>

      {data && data.error && <p style={{ color: 'red' }}>Errore: {data.error}</p>}

      {data && data.stats && (
        <div style={{ marginTop: '20px' }}>
          <h2>{data.gameName} | {data.rank} ({data.lp} LP)</h2>
          
          {data.stats.map((m, i) => (
            <details key={i} style={{ background: '#1a1a1a', margin: '8px 0', padding: '10px', borderLeft: `5px solid ${m.win ? 'green' : 'red'}` }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                {m.champion} | {m.win ? 'VITTORIA' : 'SCONFITTA'}
              </summary>
              <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
                <p>KDA: {m.kills}/{m.deaths}/{m.assists} | CS/m: {m.csPerMin} | Vision: {m.visionScore}</p>
                <strong>Altri giocatori:</strong>
                {(m.others || []).map((p, idx) => <div key={idx}>{p.name} ({p.champion}): {p.kda}</div>)}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
