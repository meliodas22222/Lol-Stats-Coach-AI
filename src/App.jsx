import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await fetch(`/api/summoner?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      alert("Errore");
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', background: '#000', minHeight: '100vh' }}>
      <h1>Debug Mode</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" style={{ color: 'black' }} />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" style={{ color: 'black' }} />
      <button onClick={handleSearch}>Cerca</button>

      <div style={{ marginTop: '20px' }}>
        {data ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <p>In attesa di ricerca...</p>
        )}
      </div>
    </div>
  );
}

export default App;
