import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const cerca = async () => {
    setLoading(true);
    const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
    setData(await res.json());
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#111', color: 'white', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={cerca}>Cerca</button>

      {data && (
        <>
          <section style={{ margin: '20px 0', padding: '15px', border: '1px solid #444', borderRadius: '10px' }}>
            <h2>📊 Profilo: {data.gameName}</h2>
            <p><strong>Rank:</strong> {data.rank} ({data.lp} LP) | <strong>Winrate Totale:</strong> {Math.round((data.totalWins / (data.totalWins + data.totalLosses)) * 100)}%</p>
          </section>

          <section style={{ margin: '20px 0' }}>
            <h3>🏆 Storico 40 Ranked</h3>
            {data.stats.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px', borderLeft: `5px solid ${m.win ? '#4CAF50' : '#F44336'}`, background: '#1a1a1a', margin: '5px 0', borderRadius: '4px' }}>
                <img src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${m.champion.replace(/[^a-zA-Z]/g, '')}.png`} style={{ width: '40px', borderRadius: '5px', marginRight: '15px' }} />
                <div style={{ flexGrow: 1 }}>
                  <strong>{m.champion}</strong> - {m.win ? 'VITTORIA' : 'SCONFITTA'}<br/>
                  <small>KDA: {m.kills}/{m.deaths}/{m.assists} | CS/m: {m.csPerMin} | Vision: {m.visionScore}</small>
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
