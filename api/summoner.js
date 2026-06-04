export default async function handler(req, res) {
  const { name, tag } = req.query;
  const RIOT_API_KEY = "RGAPI-aa2300c6-b765-4346-a8fd-fc33bc816efe";

  if (!name || !tag) return res.status(400).json({ error: "Nome e Tag mancanti" });

  try {
    const accRes = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?api_key=${RIOT_API_KEY}`);
    const acc = await accRes.json();
    if (!acc.puuid) throw new Error("Account non trovato");

    const sumRes = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${acc.puuid}?api_key=${RIOT_API_KEY}`);
    const sum = await sumRes.json();

    const leagueRes = await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${sum.id}?api_key=${RIOT_API_KEY}`);
    const league = await leagueRes.json();
    const soloQ = (Array.isArray(league) ? league : []).find(e => e.queueType === "RANKED_SOLO_5x5") || { tier: "Unranked", rank: "", leaguePoints: 0, wins: 0, losses: 0 };

    const matchIdsRes = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${acc.puuid}/ids?queue=420&start=0&count=5&api_key=${RIOT_API_KEY}`);
    const matchIds = await matchIdsRes.json();
    
    const stats = await Promise.all((matchIds || []).map(async (id) => {
      try {
        const mRes = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${RIOT_API_KEY}`);
        const m = await mRes.json();
        if (!m.info || !m.info.participants) return null;
        
        const p = m.info.participants.find(part => part.puuid === acc.puuid);
        if (!p) return null;

        return {
          champion: p.championName || "Unknown",
          win: p.win,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          kda: p.deaths === 0 ? (p.kills + p.assists).toFixed(2) : ((p.kills + p.assists) / p.deaths).toFixed(2),
          visionScore: p.visionScore || 0
        };
      } catch { return null; }
    }));

    res.status(200).json({ 
      gameName: acc.gameName, 
      rank: soloQ.tier, 
      division: soloQ.rank, 
      stats: stats.filter(s => s !== null) 
    });
  } catch (e) { 
    res.status(500).json({ error: e.message }); 
  }
}
