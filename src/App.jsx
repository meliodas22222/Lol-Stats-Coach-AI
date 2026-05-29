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
          <h2>Statistiche recenti per {data.account.gameName}</h2>
          {data.rankedMatches.map((match, index) => (
            <div key={index} style={{ border: '1px solid #444', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
              <p><strong>Partita:</strong> {match.info.gameMode}</p>
              <p><strong>Durata:</strong> {Math.floor(match.info.gameDuration / 60)} minuti</p>
              <p><strong>Match ID:</strong> {match.metadata.matchId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
