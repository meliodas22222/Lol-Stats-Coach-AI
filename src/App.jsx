import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('STZ Meliodas');
  const [tag, setTag] = useState('CXXVI');

  const eseguiCerca = () => {
    alert("Hai cliccato il tasto! Il bottone è collegato.");
    console.log("Ricerca avviata per:", name, tag);
  };

  return (
    <div style={{ padding: '20px', color: 'white', background: '#111', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>LoL Stats Coach AI</h1>
      <input 
        placeholder="Nome" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        style={{ color: 'black' }} 
      />
      <input 
        placeholder="Tag" 
        value={tag} 
        onChange={(e) => setTag(e.target.value)} 
        style={{ color: 'black' }} 
      />
      <button onClick={eseguiCerca}>Cerca</button>
    </div>
  );
}
