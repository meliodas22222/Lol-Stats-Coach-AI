import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    const res = await fetch(`/api/summoner?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
    const result = await res.json();
    setData(result);
  };

  return (
    <div style={{ padding: '20px', color: 'white', background: '#111', minHeight: '100vh' }}>
      <h1>Ultime 3 Partite Classificate</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" style={{ color: 'black' }} />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" style={{ color: 'black' }} />
      <button onClick={handleSearch}>Cerca</button>

      {data?.rankedMatches?.map((match, index) => {
        const p = match.info.participants.find(part => part.puuid === data.account.puuid);
        return (
          <div key={index} style={{ marginTop: '20px', padding: '15px', background: p.win ? '#1a3a1a' : '#3a1a1a', borderRadius: '10px' }}>
            <h3>{p.championName} - {p.win ? "VITTORIA" : "SCONFITTA"}</h3>
            <p>KDA: {p.kills}/{p.deaths}/{p.assists}</p>
            <p>Rank nella sfida: {p.challenges?.rank || "Non disponibile"}</p>
          </div>
        );
      })}
    </div>
  );
}

export default App;
