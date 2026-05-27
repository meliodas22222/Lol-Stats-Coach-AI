import { useState } from 'react';

export default function App() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("In attesa...");

  const handleSearch = async () => {
    setStatus("Caricamento in corso...");
    try {
      const res = await fetch(`/api/summoner?name=STZ%20Meliodas&tag=CXXVI`);
      const json = await res.json();
      setData(json);
      setStatus("Dati ricevuti!");
    } catch (err) {
      setStatus("Errore nel recupero dati");
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', background: '#333', minHeight: '100vh' }}>
      <h1>LoL Debugger</h1>
      <button onClick={handleSearch} style={{ padding: '10px' }}>Esegui Ricerca Test</button>
      
      <p>Stato: {status}</p>

      {/* Questa parte è protetta: se data è nullo, non fa nulla */}
      {data && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#000' }}>
          <h3>Dati ricevuti:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
