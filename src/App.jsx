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

  return (
    <div style={{ padding: '20px', color: 'white', background: '#111', minHeight: '100vh' }}>
      <h1>LoL Stats</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" style={{ color: 'black', marginRight: '10px' }} />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" style={{ color: 'black', marginRight: '10px' }} />
      <button onClick={handleSearch} style={{ padding: '5px 15px' }}>Cerca</button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2>{result.account.gameName}</h2>
          <p>Livello: {result.summoner.summonerLevel}</p>
          <h3>Ultime 5 partite (Match ID):</h3>
          <ul>
            {result.matchIds.map(id => <li key={id}>{id}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
