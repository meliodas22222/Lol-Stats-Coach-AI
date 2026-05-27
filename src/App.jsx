import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      setError(null);
      // Chiamiamo il nostro server (api/summoner.js) passando nome e tag
      const response = await fetch(`/api/summoner?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch (err) {
      setError("Errore nella connessione al server");
      console.error(err);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Cerca Evocatore</h1>
      
      <div className="flex gap-2 mb-4">
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Nome (es. Meliodas)" 
          className="border p-2"
        />
        <input 
          value={tag} 
          onChange={(e) => setTag(e.target.value)} 
          placeholder="Tag (es. EUW)" 
          className="border p-2"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2">Cerca</button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      
      {data && (
        <div className="mt-5 p-4 border rounded bg-gray-100">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
