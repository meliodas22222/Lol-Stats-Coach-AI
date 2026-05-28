import { useState } from 'react';

export default function App() {
  // Inizializziamo i campi vuoti
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);

  const cerca = async () => {
    // Se non scrivi nulla, non facciamo partire la chiamata inutile
    if (!name || !tag) return;
    
    const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
    const result = await res.json();
    setData(result);
  };

  return (
    <div style={{ padding: '20px', background: '#fff', color: '#000' }}>
      <h1>LoL Stats Coach AI</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {/* Ora sei tu a scrivere il nome e il tag */}
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Nome Summoner" 
        />
        <span>#</span>
        <input 
          value={tag} 
          onChange={e => setTag(e.target.value)} 
          placeholder="Tag" 
          style={{ width: '80px' }} 
        />
        <button onClick={cerca}>Cerca</button>
      </div>

      {data && (
        <div>
          <h2>Risultati per: {name}#{tag}</h2>
          {/* Qui puoi iniziare a visualizzare i dati che ti servono */}
          <pre>{JSON.stringify(data.account, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
