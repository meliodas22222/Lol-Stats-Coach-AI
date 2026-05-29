import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cerca = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
      const result = await res.json();
      if (res.ok) setData(result);
      else setError(result.error || "Errore sconosciuto");
    } catch (e) { setError("Errore di connessione"); }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#111', color: 'white', minHeight: '100vh' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={cerca}>Cerca</button>

      {error && <p style={{ color: 'red' }}>Errore: {error}</p>}
      
      {data && (
        <div>
          <h2>{data.gameName} - {data.rank} ({data.lp} LP)</h2>
          {data.stats.map((m, i) => (
            <div key={i} style={{ borderBottom: '1px solid #333', padding: '5px' }}>
              {m.champion} | {m.win ? 'V' : 'S'} | {m.kills}/{m.deaths}/{m.assists}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
