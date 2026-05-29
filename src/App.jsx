import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const cerca = async () => {
    setLoading(true);
    const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
    const result = await res.json();
    setData(result);
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#111', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={cerca}>Cerca</button>

      {data && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ border: '1px solid #555', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
            <h2>{data.gameName}</h2>
            <p><strong>Rank:</strong> {data.rank} ({data.lp} LP)</p>
            <p><strong>Stagione:</strong> {data.wins} W / {data.losses} L</p>
          </div>
          <h3>Ultime SoloQ:</h3>
          {data.matches.map((m, i) => (
            <div key={i} style={{ padding: '10px', borderBottom: '1px solid #333', color: m.win ? '#4CAF50' : '#F44336' }}>
              {m.champion} | KDA: {m.kills}/{m.deaths}/{m.assists} | {m.win ? 'VITTORIA' : 'SCONFITTA'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
