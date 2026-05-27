import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    const res = await fetch(`/api/summoner?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
    const data = await res.json();
    setResult(data);
  };

  // Funzione per trovare il rank specifico
  const getRank = (type) => result?.rankData?.find(r => r.queueType === type);

  return (
    <div style={{ padding: '20px', color: 'white', background: '#111', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>LoL Stats Coach AI</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" style={{ color: 'black' }} />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" style={{ color: 'black' }} />
      <button onClick={handleSearch} style={{ marginLeft: '10px' }}>Cerca</button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2>{result.account.gameName} - Livello {result.summoner.summonerLevel}</h2>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Box Solo/Duo */}
            <div style={{ background: '#222', padding: '15px', borderRadius: '10px' }}>
              <h3>Solo/Duo</h3>
              {getRank("RANKED_SOLO_5x5") ? (
                <div>
                  <p>{getRank("RANKED_SOLO_5x5").tier} {getRank("RANKED_SOLO_5x5").rank}</p>
                  <p>{getRank("RANKED_SOLO_5x5").leaguePoints} LP</p>
                  <p>WR: {((getRank("RANKED_SOLO_5x5").wins / (getRank("RANKED_SOLO_5x5").wins + getRank("RANKED_SOLO_5x5").losses)) * 100).toFixed(0)}%</p>
                </div>
              ) : <p>Nessun Rank</p>}
            </div>

            {/* Box Flex */}
            <div style={{ background: '#222', padding: '15px', borderRadius: '10px' }}>
              <h3>Flex</h3>
              {getRank("RANKED_FLEX_SR") ? (
                <div>
                  <p>{getRank("RANKED_FLEX_SR").tier} {getRank("RANKED_FLEX_SR").rank}</p>
                  <p>{getRank("RANKED_FLEX_SR").leaguePoints} LP</p>
                  <p>WR: {((getRank("RANKED_FLEX_SR").wins / (getRank("RANKED_FLEX_SR").wins + getRank("RANKED_FLEX_SR").losses)) * 100).toFixed(0)}%</p>
                </div>
              ) : <p>Nessun Rank</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
