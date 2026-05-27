// api/summoner.js
export default async function handler(req, res) {
  const { name } = req.query;
  const apiKey = process.env.VITE_RIOT_API_KEY;

  try {
    const response = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}?api_key=${apiKey}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Errore server" });
  }
}
