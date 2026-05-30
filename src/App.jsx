import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);

  const cerca = async () => {
    const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
    setData(await res.json());
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#050505', color: '#eee', fontFamily: 'sans-serif' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={cerca}>Cerca</button>

      {data && (
        <>
          <h2>{data.gameName} | {data.rank} {data.division} ({data.lp} LP)</h2>
          <p>Winrate Totale: {((data.wins/(data.wins+data.losses))*100).toFixed(0)}%</p>
          {data.stats.map((m, i) => (
            <details key={i} style={{ margin: '10px 0', padding: '10px', borderLeft: `5px solid ${m.win ? '#2e7d32' : '#c62828'}`, background: '#111' }}>
              <summary style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <img src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${m.champion === 'Fiddlesticks' ? 'Fiddlesticks' : m.champion.charAt(0).toUpperCase() + m.champion.slice(1)}.png`} width="30" style={{ marginRight: '10px' }} />
                {m.champion} | {m.win ? 'VITTORIA' : 'SCONFITTA'} | {m.duration} min | Team Kills: {m.teamKills}-{m.enemyKills}
              </summary>
              <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><strong>Alleati:</strong> {m.players.filter(p => p.team === (m.players.find(x => x.name === data.gameName)?.team)).map((p, x) => <div key={x}>{p.champ}: {p.kda}</div>)}</div>
                <div><strong>Nemici:</strong> {m.players.filter(p => p.team !== (m.players.find(x => x.name === data.gameName)?.team)).map((p, x) => <div key={x}>{p.champ}: {p.kda}</div>)}</div>
              </div>
            </details>
          ))}
        </>
      )}
    </div>
  );
}
