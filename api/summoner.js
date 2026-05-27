export default async function handler(req, res) {
  // Ora ci aspettiamo nome e tag
  const { name, tag } = req.query; 
  const apiKey = process.env.VITE_RIOT_API_KEY;

  try {
    // Usiamo l'endpoint corretto per il Riot ID
    const response = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
      headers: { "X-Riot-Token": apiKey }
    });
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Errore nel server" });
  }
}
