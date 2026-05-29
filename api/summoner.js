export default async function handler(req, res) {
  const { name, tag } = req.query;
  const RIOT_API_KEY = "RGAPI-f7e8628a-9a64-4c87-8e8c-24c8cba88ae8";

  if (!name || !tag) return res.status(400).json({ error: "Dati mancanti" });

  try {
    const accRes = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?api_key=${RIOT_API_KEY}`);
    const accData = await accRes.json();
    if (!accData.puuid) throw new Error("Account non trovato");

    // Rank
    const sumRes = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accData.puuid}?api_key=${RIOT_API_KEY}`);
    const sumData = await sumRes.json();
    const leagueRes = await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${sumData.id}?api_key=${RIOT_API_KEY}`);
    const leagueData = await leagueRes.json();
    const soloQ = (Array.isArray(leagueData) ? leagueData : []).find(e => e.queueType === "RANKED_SOLO_5x5") || {};

    // Match (limitiamo a 20 inizialmente per testare la stabilità)
    const idsRes = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${accData.puuid}/ids?queue=420&start=0&count=20&api_key=${RIOT_API_KEY}`);
    const matchIds = await idsRes.json();
    
    if (!Array.isArray(matchIds)) throw new Error("Impossibile recuperare i match");

    const matchDetails = await Promise.all(matchIds.map(async (id) => {
      const d = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${RIOT_API_KEY}`);
      return await d.json();
    }));

    const stats = matchDetails.filter(m => m.info).map(match => {
      const p = match.info.participants.find(part => part.puuid === accData.puuid);
      return { champion: p.championName, kills: p.kills, deaths: p.deaths, assists: p.assists, win: p.win };
    });

    res.status(200).json({ 
      gameName: accData.gameName,
      rank: soloQ.tier ? `${soloQ.tier} ${soloQ.rank}` : "Unranked",
      lp: soloQ.leaguePoints || 0,
      stats: stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
