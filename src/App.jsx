export default function App() {
  const testFetch = async () => {
    try {
      const response = await fetch('/api/summoner?name=STZ%20Meliodas&tag=CXXVI');
      const data = await response.json();
      // Scriviamo direttamente nel body per vedere se il DOM risponde
      document.body.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (e) {
      document.body.innerHTML = "Errore di connessione al server";
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>Test Semplice</h1>
      <button onClick={testFetch} style={{ padding: '20px', fontSize: '20px' }}>
        Clicca per visualizzare i dati grezzi
      </button>
    </div>
  );
}
