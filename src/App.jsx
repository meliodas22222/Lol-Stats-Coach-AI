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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-xl border border-gray-700">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" className="w-full bg-gray-700 p-2 mb-2 rounded" />
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Tag" className="w-full bg-gray-700 p-2 mb-2 rounded" />
        <button onClick={handleSearch} className="w-full bg-blue-600 p-2 rounded font-bold">Cerca</button>

        {data && (
          <div className="mt-6">
            {data.error ? (
              <p className="text-red-500 font-bold">Errore: {data.error}</p>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">{data.gameName}</h2>
                <p className="text-gray-400">Livello: {data.summonerLevel}</p>
                <div className="mt-4 p-3 bg-gray-700 rounded">
                  <h3 className="font-bold">Rank:</h3>
                  <pre className="text-xs">{JSON.stringify(data.rankData, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
