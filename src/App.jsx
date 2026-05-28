<div style={{ 
  maxWidth: '800px', 
  margin: '0 auto', 
  fontFamily: 'Arial, sans-serif' 
}}>
  {/* Header moderno */}
  <header style={{ textAlign: 'center', padding: '20px' }}>
    <h1>LoL Coach Dashboard</h1>
  </header>

  {/* Card delle statistiche */}
  <section style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
    gap: '15px' 
  }}>
    {elaboraPartite(data).map((p, index) => (
      <div key={index} style={{ 
        background: p.vittoria === "Vittoria" ? '#1e3a2e' : '#3a1e1e',
        border: '1px solid #444',
        borderRadius: '8px',
        padding: '15px'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>{p.campione}</h3>
        <p>KDA: {p.kda}</p>
        <p>CS/min: {(p.cs / p.durata).toFixed(1)}</p>
        <p>Vision Score: {p.visionScore}</p>
      </div>
    ))}
  </section>
</div>
