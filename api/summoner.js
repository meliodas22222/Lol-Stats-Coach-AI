export default async function handler(req, res) {
  const { name, tag } = req.query;
  const apiKey = process.env.VITE_RIOT_API_KEY;

  try {
    const accRes = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
      headers: { "X-Riot-Token": apiKey }
    });
    const account = await accRes.json();

    // Prendiamo 20 partite per avere più probabilità di trovare le classificate
    const matchRes = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${account.puuid}/ids?type=ranked&start=0&count=20`, {
      headers: { "X-Riot-Token": apiKey }
    });
    const matchIds = await matchRes.json();
    
    // Prendiamo i dettagli delle prime 3 partite classificate
    const rankedMatches = [];
    for (let i = 0; i < Math.min(matchIds.length, 3); i++) {
      const detailRes = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchIds[i]}`, {
        headers: { "X-Riot-Token": apiKey }
      });
      const matchDetail = await detailRes.json();
      rankedMatches.push(matchDetail);
    }

    return res.status(200).json({ account, rankedMatches });
  } catch (error) {
    return res.status(500).json({ error: "Errore" });
  }
}
