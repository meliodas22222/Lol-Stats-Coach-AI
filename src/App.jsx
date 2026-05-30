import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);

  const cerca = async () => {
    const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
    setData(await res.json());
  };

  const getChampWinrate = (champ, stats) => {
    const champMatches = stats.filter(s => s.champion === champ);
    const wins = champMatches.filter(s => s.win).length;
    return Math.round((wins / champMatches.length) * 100);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#111', color: 'white', maxWidth: '800px', margin: 'auto' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={cerca}>Cerca</button>

      {data && (
        <div style={{ marginTop: '20px' }}>
          <h2>📊 {data.gameName} | {data.rank}</h2>
          <p>Winrate Totale: {((data.wins/(data.wins+data.losses))*100).toFixed(0)}%</p>

          <h3>🏆 Storico Recente</h3>
          {data.stats.map((m, i) => (
            <details key={i} style={{ background: '#222', margin: '5px 0', padding: '10px', borderLeft: `5px solid ${m.win ? 'green' : 'red'}` }}>
              <summary style={{ cursor: 'pointer' }}>
                {m.champion} | {m.win ? 'VITTORIA' : 'SCONFITTA'} | WR Campione: {getChampWinrate(m.champion, data.stats)}%
              </summary>
              <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
                <p>KDA: {m.kills}/{m.deaths}/{m.assists} | CS/m: {m.csPerMin} | Vision: {m.visionScore}</p>
                <hr />
                <strong>Altri giocatori:</strong>
                {m.others.map((p, idx) => <div key={idx}>{p.name} ({p.champion}): {p.kda}</div>)}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
