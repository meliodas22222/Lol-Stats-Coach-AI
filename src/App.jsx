import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);

  // 1. Questa funzione serve per "pulire" i dati
  const elaboraPartite = (data) => {
    if (!data || !data.rankedMatches) return [];
    return data.rankedMatches.map(match => {
      const me = match.info.participants.find(p => p.puuid === data.account.puuid);
      return {
        campione: me.championName,
        kda: `${me.kills}/${me.deaths}/${me.assists}`,
        vittoria: me.win ? "Vittoria" : "Sconfitta",
        durata: Math.floor(match.info.gameDuration / 60) + " min"
      };
    });
  };

  const cerca = async () => {
    if (!name || !tag) return;
    const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
    const result = await res.json();
    setData(result);
  };

  return (
    <div style={{ padding: '20px', background: '#fff', color: '#000' }}>
      <h1>LoL Stats Coach AI</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
        <span>#</span>
        <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" style={{ width: '80px' }} />
        <button onClick={cerca}>Cerca</button>
      </div>

      {/* 2. Qui mostriamo le partite */}
      {data && (
        <div>
          <h2>Statistiche recenti per: {name}#{tag}</h2>
          {elaboraPartite(data).map((p, index) => (
            <div key={index} style={{ border: '1px solid #444', padding: '10px', margin: '10px 0', background: '#222', color: '#fff' }}>
              <p><strong>{p.campione}</strong> - {p.vittoria}</p>
              <p>KDA: {p.kda} | Durata: {p.durata}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
