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

  // Troviamo il partecipante che sei tu
  const myData = data?.matchDetail?.info?.participants?.find(p => p.puuid === data.account.puuid);

  return (
    <div style={{ padding: '20px', color: 'white', background: '#111', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" style={{ color: 'black' }} />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" style={{ color: 'black' }} />
      <button onClick={handleSearch}>Cerca</button>

      {myData && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#222', borderRadius: '10px' }}>
          <h2>{data.account.gameName}</h2>
          <p>Ultimo Campione: {myData.championName}</p>
          <p>KDA: {myData.kills}/{myData.deaths}/{myData.assists}</p>
          
          <div style={{ marginTop: '20px', borderTop: '1px solid #444', paddingTop: '10px' }}>
            <h3>Dettagli Rank dall'ultima partita:</h3>
            <p>Tier (Range): {myData.challenges?.rank ? myData.challenges.rank : "Dato non disponibile in questo match"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
