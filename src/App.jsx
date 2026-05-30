import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cerca = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#111', color: '#eee', minHeight: '100vh' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={cerca} disabled={loading}>{loading ? 'Caricamento...' : 'Cerca'}</button>

      {error && <p style={{ color: '#ff4444' }}>Errore: {error}</p>}

      {data && (
        <div style={{ marginTop: '20px' }}>
          <h2>{data.gameName} | {data.rank} ({data.lp} LP)</h2>
          {data.stats.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #333' }}>
              <img src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${m.champion.replace(/[^a-zA-Z]/g, '')}.png`} style={{ width: '30px', marginRight: '10px' }} />
              <span style={{ color: m.win ? '#4CAF50' : '#F44336' }}>{m.win ? 'V' : 'S'}</span>
              <span style={{ marginLeft: '10px' }}>{m.champion} | KDA: {m.kills}/{m.deaths}/{m.assists}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
