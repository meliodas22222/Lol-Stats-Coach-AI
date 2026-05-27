import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/summoner?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      alert("Errore nel recupero dati");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">LoL Stats Coach AI</h1>
        
        <div className="flex gap-2 mb-8 bg-gray-800 p-4 rounded-lg">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" className="bg-gray-700 p-2 rounded w-full border-none outline-none" />
          <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Tag" className="bg-gray-700 p-2 rounded w-24 border-none outline-none" />
          <button onClick={handleSearch} className="bg-blue-600 px-6 py-2 rounded font-bold hover:bg-blue-500 transition">
            {loading ? "..." : "Cerca"}
          </button>
        </div>

        {data && !data.error && (
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center gap-6">
            <img 
              src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${data.profileIconId}.png`} 
              alt="Icona" className="w-24 h-24 rounded-full border-4 border-blue-500" 
            />
            <div>
              <h2 className="text-3xl font-bold">{data.gameName}</h2>
              <p className="text-gray-400 text-lg">Livello: {data.summonerLevel}</p>
              <p className="text-blue-400 font-mono">#{data.tagLine}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
