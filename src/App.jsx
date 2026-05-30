import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const cerca = async () => {
    setLoading(true);
    const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
    const d = await res.json();
    setData(d);
    setLoading(false);
  };

  const getChampStats = (stats) => {
    const map = {};
    stats.forEach(s => {
      if (!map[s.champion]) map[s.champion] = { w: 0, l: 0 };
      s.win ? map[s.champion].w++ : map[s.champion].l++;
    });
    return map;
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#111', color: 'white', fontFamily: 'sans-serif' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={cerca} disabled={loading}>{loading ? 'Caricamento...' : 'Cerca'}</button>

      {data && (
        <div style={{ marginTop: '20px' }}>
          <h2>{data.gameName} | {data.rank} - {data.lp} LP</h2>
          <p><strong>Winrate Stagione:</strong> {data.totalWins + data.totalLosses > 0 ? Math.round((data.totalWins / (data.totalWins + data.totalLosses)) * 100) : 0}%</p>
          
          <h3>Winrate per Campione (ultime 40):</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Object.entries(getChampStats(data.stats)).map(([c, s]) => (
              <div key={c} style={{ background: '#222', padding: '8px', borderRadius: '5px', fontSize: '12px' }}>
                <img src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${c.replace(/[^a-zA-Z]/g, '')}.png`} style={{ width: '20px', verticalAlign: 'middle', marginRight: '5px' }} />
                {c}: {Math.round((s.w / (s.w + s.l)) * 100)}%
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
