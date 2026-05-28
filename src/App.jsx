import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('STZ Meliodas');
  const [risposta, setRisposta] = useState("In attesa...");

  const cerca = async () => {
    setRisposta("Caricamento...");
    try {
      // Usiamo una variabile fissa per il test
      const res = await fetch(`/api/summoner?name=${name}&tag=CXXVI`);
      const data = await res.json();
      
      // Se arriviamo qui, il server ha risposto
      setRisposta(JSON.stringify(data, null, 2));
    } catch (e) {
      // Se c'è un errore, lo scriviamo invece di far crashare tutto
      setRisposta("ERRORE: " + e.toString());
    }
  };

  return (
    <div style={{ padding: '20px', background: '#fff', color: '#000', fontFamily: 'sans-serif' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={cerca}>Cerca</button>
      <pre style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
        {risposta}
      </pre>
    </div>
  );
}
