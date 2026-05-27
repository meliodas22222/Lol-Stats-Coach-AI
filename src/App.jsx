import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await fetch(`/api/summoner?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Errore fetch:", err);
    }
  };

  const getRank = (type) => result?.rankData?.find(r => r.queueType === type);

  return (
    <div style={{ padding: '20px', color: 'white', background: '#111', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" style={{ color: 'black' }} />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" style={{ color: 'black' }} />
      <button onClick={handleSearch} style={{ marginLeft: '10px' }}>Cerca</button>

      {result ? (
        <div style={{ marginTop: '20px' }}>
          <h2>{result.account?.gameName || "Nessun nome"} - Livello {result.summoner?.summonerLevel || 0}</h2>
          
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <div style={{ background: '#222', padding: '15px', borderRadius: '10px', minWidth: '150px' }}>
              <h3>Solo/Duo</h3>
              {getRank("RANKED_SOLO_5x5") ? (
                <div>
                  <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{getRank("RANKED_SOLO_5x5").tier} {getRank("RANKED_SOLO_5x5").rank}</p>
                  <p>{getRank("RANKED_SOLO_5x5").leaguePoints} LP</p>
                  <p>WR: {Math.round((getRank("RANKED_SOLO_5x5").wins / (getRank("RANKED_SOLO_5x5").wins + getRank("RANKED_SOLO_5x5").losses)) * 100)}%</p>
                </div>
              ) : <p>Non classificato</p>}
            </div>

            <div style={{ background: '#222', padding: '15px', borderRadius: '10px', minWidth: '150px' }}>
              <h3>Flex</h3>
              {getRank("RANKED_FLEX_SR") ? (
                <div>
                  <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{getRank("RANKED_FLEX_SR").tier} {getRank("RANKED_FLEX_SR").rank}</p>
                  <p>{getRank("RANKED_FLEX_SR").leaguePoints} LP</p>
                  <p>WR: {Math.round((getRank("RANKED_FLEX_SR").wins / (getRank("RANKED_FLEX_SR").wins + getRank("RANKED_FLEX_SR").losses)) * 100)}%</p>
                </div>
              ) : <p>Non classificato</p>}
            </div>
          </div>
        </div>
      ) : (
        <p style={{ marginTop: '20px' }}>Inserisci il nome e clicca Cerca</p>
      )}
    </div>
  );
}

export default App;
