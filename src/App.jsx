import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('STZ Meliodas');
  const [tag, setTag] = useState('CXXVI');
  const [data, setData] = useState(null);

  const cerca = async () => {
    const res = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
    const result = await res.json();
    setData(result);
  };

  return (
    <div style={{ padding: '20px', background: '#fff', color: '#000' }}>
      <h1>LoL Stats Coach AI</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
        <span>#</span>
        <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" style={{ width: '80px' }} />
        <button onClick={cerca}>Cerca</button>
      </div>

      {data && (
        <div>
          <h2>Giocatore: {data.account.gameName}#{data.account.tagLine}</h2>
          <p>Hai trovato {data.rankedMatches.length} partite recenti.</p>
          <pre style={{ background: '#f4f4f4', padding: '10px' }}>
            {JSON.stringify(data.rankedMatches[0].info.gameMode, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
