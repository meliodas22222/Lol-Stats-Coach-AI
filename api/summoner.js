export default async function handler(req, res) {
  const { name, tag } = req.query;
  const apiKey = process.env.VITE_RIOT_API_KEY;

  try {
    // 1. Account
    const accRes = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
      headers: { "X-Riot-Token": apiKey }
    });
    const account = await accRes.json();

    // 2. Ultime 5 partite (IDs)
    const matchRes = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${account.puuid}/ids?start=0&count=5`, {
      headers: { "X-Riot-Token": apiKey }
    });
    const matchIds = await matchRes.json();
    
    // 3. Dettagli ULTIMA partita (qui dentro c'è il rank che cerchi)
    const detailRes = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchIds[0]}`, {
      headers: { "X-Riot-Token": apiKey }
    });
    const matchDetail = await detailRes.json();

    return res.status(200).json({ account, matchDetail });
  } catch (error) {
    return res.status(500).json({ error: "Errore nel recupero dati" });
  }
}
