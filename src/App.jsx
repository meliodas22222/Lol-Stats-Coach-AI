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

  const getChampImg = (n) => `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${n.replace(/[^a-zA-Z]/g, '')}.png`;

  return (
    <div style={{ padding: '20px', backgroundColor: '#111', color: 'white', fontFamily: 'sans-serif' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={cerca} disabled={loading}>{loading ? 'Analizzando...' : 'Cerca'}</button>

      {data && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ padding: '15px', border: '1px solid #444', borderRadius: '8px' }}>
            <h2>{data.gameName}</h2>
            <p><strong>Rank:</strong> {data.rank} - {data.lp} LP</p>
            <p><strong>Winrate ultime 40:</strong> {Math.round((data.stats.filter(s => s.win).length / 40) * 100)}%</p>
          </div>

          <h3 style={{ marginTop: '20px' }}>Storico 40 Ranked:</h3>
          {data.stats.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '8px', borderBottom: '1px solid #222', color: m.win ? '#4CAF50' : '#F44336' }}>
              <img src={getChampImg(m.champion)} style={{ width: '35px', height: '35px', borderRadius: '4px', marginRight: '10px' }} />
              <strong>{m.champion}</strong> | KDA: {m.kills}/{m.deaths}/{m.assists} | {m.win ? 'VITTORIA' : 'SCONFITTA'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
