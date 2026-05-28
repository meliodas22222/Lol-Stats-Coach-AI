export default async function handler(req, res) {
  // 1. Recupera i parametri dalla richiesta (name e tag)
  const { name, tag } = req.query;

  // 2. Controllo di base per assicurarsi che i dati siano presenti
  if (!name || !tag) {
    return res.status(400).json({ error: "Nome e Tag richiesti" });
  }

  try {
    // 3. Qui metti tutta la tua logica (chiamata a Riot API, ecc.)
    // ... il tuo codice vecchio va qui ...

    // ESEMPIO DI RISPOSTA:
    // const stats = { ... }; 
    // return res.status(200).json(stats);

  } catch (error) {
    // 4. Gestione errori
    console.error(error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
}
