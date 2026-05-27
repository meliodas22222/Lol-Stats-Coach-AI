import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('STZ Meliodas');
  const [tag, setTag] = useState('CXXVI');
  const [risultato, setRisultato] = useState('Premi Cerca per iniziare...');

  const handleSearch = async () => {
    setRisultato("Caricamento in corso...");
    try {
      // Usiamo la fetch. Se il server risponde, vedremo il JSON
      const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
      const data = await res.json();
      setRisultato(JSON.stringify(data, null, 2));
    } catch (err) {
      setRisultato("Errore nel recupero dati: " + err.message);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#fff', color: '#000', minHeight: '100vh' }}>
      <h1>LoL Stat Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={tag} onChange={e => setTag(e.target.value)} />
      <button onClick={handleSearch}>CERCA DATI</button>
      
      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', border: '1px solid #ccc', padding: '10px' }}>
        <strong>Risultato:</strong>
        <p>{risultato}</p>
      </div>
    </div>
  );
}
