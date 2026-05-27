import { useState } from 'react';

export default function App() {
  const [test, setTest] = useState("Sito Caricato");

  return (
    <div style={{ padding: '50px', background: 'white', color: 'black', minHeight: '100vh' }}>
      <h1>{test}</h1>
      <button onClick={() => setTest("IL CLICK FUNZIONA!")} style={{ padding: '20px', fontSize: '20px' }}>
        Clicca qui per testare
      </button>
    </div>
  );
}
