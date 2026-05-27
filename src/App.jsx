import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');

  const handleSearch = async () => {
    console.log("Bottone cliccato per:", name, tag);
    alert("Il bottone funziona! Controlla la console (F12) per i dettagli.");
    
    try {
      const res = await fetch(`/api/summoner?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
      const data = await res.json();
      console.log("Risposta dal server:", data);
    } catch (err) {
      console.error("Errore fatale:", err);
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>Debug Test</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" style={{ color: 'black' }} />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" style={{ color: 'black' }} />
      <button onClick={handleSearch} style={{ padding: '10px 20px', cursor: 'pointer' }}>Cerca</button>
    </div>
  );
}

export default App;
