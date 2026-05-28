import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);
  const [errore, setErrore] = useState('');

  const elaboraPartite = (data) => {
    if (!data || !data.rankedMatches) return [];
    return data.rankedMatches.map(match => {
      const me = match.info.participants.find(p => p.puuid === data.account.puuid);
      return {
        campione: me ? me.championName : "Sconosciuto",
        kda: me ? `${me.kills}/${me.deaths}/${me.assists}` : "0/0/0",
        vittoria: me && me.win ? "Vittoria" : "Sconfitta",
        durata: match.info.gameDuration / 60, 
        cs: me ? (me.totalMinionsKilled + (me.neutralMinionsKilled || 0)) : 0,
        visionScore: me ? me.visionScore : 0
      };
    });
  };

  const calcolaWinRateTotale = (partite) => {
    if (partite.length === 0) return "0%";
    const vittorie = partite.filter(p => p.vittoria === "Vittoria").length;
    return ((vittorie / partite.length) * 100).toFixed(0) + "%";
  };

  const calcolaWinRateCampioni = (partite) => {
    const campioni = {};
    partite.forEach(p => {
      if (!campioni[p.campione]) {
        campioni[p.campione] = { vittorie: 0, totali: 0 };
      }
      campioni[p.campione].totali += 1;
      if (p.vittoria === "Vittoria") {
        campioni[p.campione].vittorie += 1;
      }
    });

    return Object.keys(campioni).map(nomeCampione => {
      const c = campioni[nomeCampione];
      const wr = ((c.vittorie / c.totali) * 100).toFixed(0) + "%";
      return { nome: nomeCampione, winRate: wr, giocate: c.totali };
    });
  };

  const cerca = async () => {
    if (!name || !tag) return;
    setErrore('');
    try {
      // Modificata l'URL per bypassare la 404 della sottocartella se Vercel ha perso la rotta
      const res = await fetch(`/api/summoner?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
      if (!res.ok) throw new Error(`Server ha risposto con codice ${res.status}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      setErrore("Errore di connessione o giocatore non trovato. Verifica le rotte /api su Vercel.");
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', color: '#fff' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#f1f5f9', fontSize: '32px' }}>LoL Stats Coach AI</h1>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome Summoner" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }} />
          <span style={{ fontSize: '24px', alignSelf: 'center', color: '#64748b' }}>#</span>
          <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag" style={{ width: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }} />
          <button onClick={cerca} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer' }}>Cerca</button>
        </div>
      </header>

      {errore && <div style={{ background: '#7f1d1d', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>{errore}</div>}

      {data && (
        <div>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #334155' }}>
            <h2 style={{ marginTop: 0, fontSize: '20px', color: '#94a3b8' }}>Analisi Account: {name}#{tag}</h2>
            <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>Win Rate Totale</span>
              <p style={{ fontSize: '42px', fontWeight: 'bold', margin: '5px 0', color: '#38bdf8' }}>{calcolaWinRateTotale(elaboraPartite(data))}</p>
              <small style={{ color: '#475569' }}>Basato sulle ultime {data.rankedMatches ? data.rankedMatches.length : 0} partite analizzate</small>
            </div>
            <h3 style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '10px' }}>Performance per Campione:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              {calcolaWinRateCampioni(elaboraPartite(data)).map((campione, i) => (
                <div key={i} style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', textAlign: 'center', borderTop: '3px solid #38bdf8' }}>
                  <strong style={{ display: 'block', color: '#f1f5f9' }}>{campione.nome}</strong>
                  <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981', display: 'block', margin: '4px 0' }}>{campione.winRate}</span>
                  <small style={{ color: '#475569' }}>{campione.giocate} match</small>
                </div>
              ))}
            </div>
          </div>

          <h2 style={{ fontSize: '20px', color: '#94a3b8', marginBottom: '15px' }}>Cronologia Match:</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
            {elaboraPartite(data).map((p, index) => (
              <div key={index} style={{ background: p.vittoria === "Vittoria" ? '#14532d' : '#7f1d1d', borderRadius: '10px', padding: '20px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{p.campione}</h3>
                  <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{p.vittoria}</span>
                </div>
                <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />
                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>KDA:</strong> {p.kda}</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>CS/Min:</strong> {p.durata > 0 ? (p.cs / p.durata).toFixed(1) : 0} <span style={{color: 'rgba(255,255,255,0.6)'}}>({p.cs} tot)</span></p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Vision Score:</strong> {p.visionScore}</p>
                <p style={{ margin: '5px 0', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Durata: {Math.floor(p.durata)} min</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
