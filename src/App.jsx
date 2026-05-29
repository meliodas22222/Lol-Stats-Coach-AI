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
      if (!res.ok) throw new Error("Giocatore non trovato");
      const result = await res.json();
      setData(result);
    } catch (err) {
      setErrore("Errore nel recupero dati. Controlla il nome e il tag.");
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
        <div>
          <h2>Statistiche SoloQ: {data.winRate}% WinRate</h2>
          {data.stats.length > 0 ? (
            data.stats.map((match, index) => (
              <div key={index} style={{ border: '1px solid #444', padding: '15px', marginBottom: '10px', borderRadius: '8px', backgroundColor: match.win ? '#1a3a1a' : '#3a1a1a' }}>
                <p><strong>Campione:</strong> {match.champion}</p>
                <p><strong>KDA:</strong> {match.kills}/{match.deaths}/{match.assists}</p>
                <p><strong>Esito:</strong> {match.win ? 'Vittoria' : 'Sconfitta'}</p>
              </div>
            ))
          ) : (
            <p>Nessuna partita in SoloQ trovata negli ultimi match.</p>
          )}
        </div>
      )}
    </div>
  );
}
