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
    <div style={{ padding: '20px', color: 'white', background: '#111', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" style={{ color: 'black' }} />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" style={{ color: 'black' }} />
      <button onClick={handleSearch} style={{ marginLeft: '10px' }}>Cerca</button>

      {data && (
        <div style={{ marginTop: '20px' }}>
          <h2>{data.account.gameName}</h2>
          <p>Livello: {data.summoner.summonerLevel}</p>
          
          <div style={{ marginTop: '20px', background: '#222', padding: '15px', borderRadius: '10px' }}>
            <h3>Status Rank:</h3>
            {data.rankData.status ? (
              <p style={{ color: '#ff6b6b' }}>Dati Rank non accessibili (Chiave API limitata)</p>
            ) : (
              <p>Rank caricato correttamente</p>
            )}
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Ultime 5 partite (IDs):</h3>
            <ul>
              {data.matchIds.map(id => <li key={id}>{id}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
