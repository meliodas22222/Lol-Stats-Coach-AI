export default async function handler(req, res) {
  const { name, tag } = req.query;
  const RIOT_API_KEY = "RGAPI-f7e8628a-9a64-4c87-8e8c-24c8cba88ae8"; // INSERISCI QUI LA CHIAVE

  if (!name || !tag) return res.status(400).json({ error: "Dati mancanti" });

  try {
    // 1. Otteniamo il PUUID globale (sempre valido)
    const accRes = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?api_key=${RIOT_API_KEY}`);
    const accData = await accRes.json();
    if (!accData.puuid) throw new Error("Account non trovato");

    // 2. Chiamata DIRETTA alle leghe tramite PUUID (bypassiamo il Summoner ID)
    const leagueRes = await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${accData.puuid}?api_key=${RIOT_API_KEY}`);
    const leagueData = await leagueRes.json();
    
    // Gestione array
    const dataArray = Array.isArray(leagueData) ? leagueData : [];
    const soloQ = dataArray.find(e => e.queueType === "RANKED_SOLO_5x5") || {};

    return res.status(200).json({ 
      gameName: accData.gameName,
      rank: soloQ.tier ? `${soloQ.tier} ${soloQ.rank}` : "Unranked",
      lp: soloQ.leaguePoints || 0,
      wins: soloQ.wins || 0,
      losses: soloQ.losses || 0
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
