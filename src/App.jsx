import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    const response = await fetch(`/api/summoner?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
    const result = await response.json();
    setData(result);
  };

  const getSoloDuo = () => {
    if (!data?.rankData) return null;
    return data.rankData.find(entry => entry.queueType === "RANKED_SOLO_5x5");
  };

  const soloDuo = getSoloDuo();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-xl border border-gray-700">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" className="w-full bg-gray-700 p-2 mb-2 rounded" />
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Tag" className="w-full bg-gray-700 p-2 mb-2 rounded" />
        <button onClick={handleSearch} className="w-full bg-blue-600 p-2 rounded font-bold">Cerca</button>

        {data && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold">{data.gameName}</h2>
            <p className="text-gray-400">Livello: {data.summonerLevel}</p>
            
            <div className="mt-4 p-4 bg-gray-900 rounded border border-gray-600">
              <h3 className="font-bold text-blue-400">Ranked Solo/Duo</h3>
              {soloDuo ? (
                <p className="text-xl font-bold">{soloDuo.tier} {soloDuo.rank} - {soloDuo.leaguePoints} LP</p>
              ) : <p className="text-gray-500">Nessuna partita in Solo/Duo trovata</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
