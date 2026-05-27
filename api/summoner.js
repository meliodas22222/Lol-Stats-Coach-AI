export default async function handler(req, res) {
  const { name, tag } = req.query;
  const apiKey = process.env.VITE_RIOT_API_KEY;

  try {
    const accRes = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
      headers: { "X-Riot-Token": apiKey }
    });
    
    if (!accRes.ok) throw new Error("Riot non trova il giocatore: " + accRes.status);
    const account = await accRes.json();

    const matchRes = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${account.puuid}/ids?type=ranked&start=0&count=3`, {
      headers: { "X-Riot-Token": apiKey }
    });
    
    if (!matchRes.ok) throw new Error("Errore recupero match: " + matchRes.status);
    const matchIds = await matchRes.json();
    
    const rankedMatches = [];
    for (const matchId of matchIds) {
      const detailRes = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
        headers: { "X-Riot-Token": apiKey }
      });
      const matchDetail = await detailRes.json();
      rankedMatches.push(matchDetail);
    }

    return res.status(200).json({ account, rankedMatches });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
