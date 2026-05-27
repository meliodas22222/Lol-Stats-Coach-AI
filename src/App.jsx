export default function App() {
  return (
    <div style={{ padding: '50px', background: 'white', color: 'black' }}>
      <h1>Se vedi questa scritta, il sito è attivo!</h1>
      <button onClick={() => alert("Funziona!")}>Cliccami per testare</button>
    </div>
  );
}
