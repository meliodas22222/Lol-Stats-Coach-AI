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
    setData(null);
    try {
      const res = await fetch(`/api/summoner?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
      if (!res.ok) throw new Error("Errore server");
      const result = await res.json();
      setData(result);
    } catch (err) {
      setErrore("Errore nel recupero dati.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#111', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>LoL Stats Coach AI</h1>
      <div style={{ marginBottom: '20px' }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" style={{ marginRight: '10px', padding: '5px' }} />
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Tag" style={{ marginRight: '10px', padding: '5px' }} />
        <button onClick={cerca} style={{ padding: '5px 15px', cursor: 'pointer' }}>{loading ? 'Caricamento...' : 'Cerca'}</button>
      </div>

      {errore && <p style={{ color: 'red' }}>{errore}</p>}
      
      {data && (
        <div style={{ border: '1px solid #444', padding: '20px', borderRadius: '8px', maxWidth: '400px' }}>
          <h2>{data.gameName}</h2>
          <p><strong>Rank:</strong> {data.rank} - {data.lp} LP</p>
          <p><strong>Vittorie:</strong> {data.wins}</p>
          <p><strong>Sconfitte:</strong> {data.losses}</p>
          <p><strong>Winrate Totale:</strong> {data.wins + data.losses > 0 ? Math.round((data.wins / (data.wins + data.losses)) * 100) : 0}%</p>
        </div>
      )}
    </div>
  );
}
