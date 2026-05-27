import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    const res = await fetch(`/api/summoner?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
    const data = await res.json();
    setResult(data);
  };

  const getMyData = () => {
    if (!result?.matchDetail) return null;
    return result.matchDetail.info.participants.find(p => p.puuid === result.account.puuid);
  };

  const myData = getMyData();

  return (
    <div style={{ padding: '20px', color: 'white', background: '#111', minHeight: '100vh' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" style={{ color: 'black' }} />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" style={{ color: 'black' }} />
      <button onClick={handleSearch}>Cerca</button>

      {myData && (
        <div style={{ marginTop: '20px', background: myData.win ? '#1a3a1a' : '#3a1a1a', padding: '20px', borderRadius: '10px' }}>
          <h2>Ultima partita: {myData.win ? "VITTORIA" : "SCONFITTA"}</h2>
          <p>Campione: {myData.championName}</p>
          <p>KDA: {myData.kills}/{myData.deaths}/{myData.assists}</p>
        </div>
      )}
    </div>
  );
}

export default App;
