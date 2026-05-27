import { useState } from 'react';

export default function App() {
  const [debug, setDebug] = useState("Pronto per il test...");

  const testConnection = async () => {
    setDebug("Contattando il server...");
    try {
      const response = await fetch(`/api/summoner?name=STZ Meliodas&tag=CXXVI`);
      const status = response.status;
      const data = await response.json();
      
      setDebug(`Stato: ${status}\n\nRisposta: ${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      setDebug("Errore fatale: " + err.message);
    }
  };

  return (
    <div style={{ padding: '20px', background: 'white', color: 'black' }}>
      <h1>Debug Totale</h1>
      <button onClick={testConnection} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Verifica connessione Riot
      </button>
      <pre style={{ marginTop: '20px', background: '#f0f0f0', padding: '15px', borderRadius: '5px' }}>
        {debug}
      </pre>
    </div>
  );
}
