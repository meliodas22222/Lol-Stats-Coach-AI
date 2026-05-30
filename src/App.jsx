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

  // Calcola statistiche per campione
  const getChampStats = (stats) => {
    const champMap = {};
    stats.forEach(s => {
      if (!champMap[s.champion]) champMap[s.champion] = { w: 0, l: 0 };
      s.win ? champMap[s.champion].w++ : champMap[s.champion].l++;
    });
    return champMap;
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#111', color: 'white' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={cerca}>Cerca</button>

      {data && (
        <div style={{ marginTop: '20px' }}>
          <h2>{data.gameName} | {data.rank} ({data.lp} LP)</h2>
          <p><strong>Winrate Totale Stagione:</strong> {Math.round((data.totalWins / (data.totalWins + data.totalLosses)) * 100)}%</p>
          
          <h3>Winrate per Campione (ultime 40):</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
            {Object.entries(getChampStats(data.stats)).map(([name, s]) => (
              <div key={name} style={{ background: '#222', padding: '5px', borderRadius: '5px' }}>
                {name}: {Math.round((s.w / (s.w + s.l)) * 100)}% ({s.w}W/{s.l}L)
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
