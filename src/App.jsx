export default function App() {
  function test() {
    console.log("Il pulsante funziona!");
    alert("Il sistema è attivo.");
  }
  
  return (
    <div style={{ padding: '50px', backgroundColor: 'white', color: 'black', minHeight: '100vh' }}>
      <h1 style={{ color: 'black' }}>Test di Riavvio</h1>
      <button onClick={test} style={{ fontSize: '20px', padding: '10px 20px' }}>
        Clicca per verificare il sistema
      </button>
    </div>
  );
}
