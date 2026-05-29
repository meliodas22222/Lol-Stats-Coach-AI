export default async function handler(req, res) {
  const { name, tag } = req.query;
  const RIOT_API_KEY = "RGAPI-f7e8628a-9a64-4c87-8e8c-24c8cba88ae8"; // INSERISCI QUI LA TUA CHIAVE

  if (!name || !tag) return res.status(400).json({ error: "Nome e Tag mancanti" });

  try {
    // 1. Ottieni ID account
    const accountRes = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?api_key=${RIOT_API_KEY}`);
    const accountData = await accountRes.json();
    if (!accountData.puuid) return res.status(404).json({ error: "Giocatore non trovato" });

    // 2. Ottieni Summoner ID (necessario per le League)
    const summonerRes = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountData.puuid}?api_key=${RIOT_API_KEY}`);
    const summonerData = await summonerRes.json();

    // 3. Ottieni Rank SoloQ
    const leagueRes = await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${RIOT_API_KEY}`);
    const leagueData = await leagueRes.json();
    
    // Filtriamo per la coda SoloQ (RANKED_SOLO_5x5)
    const soloQ = leagueData.find(entry => entry.queueType === "RANKED_SOLO_5x5");

    return res.status(200).json({ 
      gameName: accountData.gameName,
      rank: soloQ ? `${soloQ.tier} ${soloQ.rank}` : "Unranked",
      lp: soloQ ? soloQ.leaguePoints : 0,
      wins: soloQ ? soloQ.wins : 0,
      losses: soloQ ? soloQ.losses : 0
    });
  } catch (error) {
    return res.status(500).json({ error: "Errore nel recupero dati" });
  }
}
