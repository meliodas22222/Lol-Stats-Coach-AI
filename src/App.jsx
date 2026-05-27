import { useState } from 'react';

function App() {
  const [summonerName, setSummonerName] = useState('');
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    try {
      // Questa riga chiama il nostro "ponte" (l'api che abbiamo creato)
      const response = await fetch(`/api/summoner?name=${encodeURIComponent(summonerName)}`);
      const result = await response.json();
      console.log("Dati ricevuti:", result);
      setData(result);
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  return (
    <div className="p-5">
      <input 
        value={summonerName} 
        onChange={(e) => setSummonerName(e.target.value)} 
        placeholder="Nome evocatore..." 
        className="border p-2"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2 ml-2">Cerca</button>
      
      {data && (
        <pre className="mt-5">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}

export default App;
