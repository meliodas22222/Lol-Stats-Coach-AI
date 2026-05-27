import { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!name || !tag) return;
    setLoading(true);
    try {
      // Aggiungiamo un timestamp alla URL per evitare il 304 (cache)
      const res = await fetch(`/api/summoner?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}&t=${Date.now()}`);
      const result = await res.json();
      setData(result);
      alert("Dati ricevuti!");
    } catch (err) {
      console.error("Errore:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>LoL Stats Debug</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Caricamento..." : "Cerca"}
      </button>

      <pre style={{ marginTop: '20px', background: '#eee' }}>
        {data ? JSON.stringify(data, null, 2) : "Nessun dato"}
      </pre>
    </div>
  );
}

export default App;
