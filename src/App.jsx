import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState('');

  const cerca = async () => {
    setLoading(true);
    setErrore('');
    try {
      const res = await fetch(`/api/summoner?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
      if (!res.ok) throw new Error("Giocatore non trovato");
      const result = await res.json();
      setData(result);
    } catch (err) {
      setErrore("Errore nel recupero dati. Controlla nome e tag.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#111', minHeight: '100vh' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
      <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Tag" />
      <button onClick={cerca}>{loading ? 'Caricamento...' : 'Cerca'}</button>

      {errore && <p style={{ color: 'red' }}>{errore}</p>}
      {data && (
        <pre style={{ marginTop: '20px' }}>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
