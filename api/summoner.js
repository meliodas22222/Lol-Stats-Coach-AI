export default async function handler(req, res) {
  const { name, tag } = req.query;
  const RIOT_API_KEY = "RGAPI-f7e8628a-9a64-4c87-8e8c-24c8cba88ae8";

  try {
    const accRes = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?api_key=${RIOT_API_KEY}`);
    const accData = await accRes.json();
    if (!accData.puuid) throw new Error("Account non trovato");

    const summonerRes = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accData.puuid}?api_key=${RIOT_API_KEY}`);
    const sumData = await summonerRes.json();
    
    const leagueRes = await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${sumData.id}?api_key=${RIOT_API_KEY}`);
    const leagueData = await leagueRes.json();
    const soloQ = leagueData.find(e => e.queueType === "RANKED_SOLO_5x5") || { wins: 0, losses: 0, tier: "Unranked", rank: "", leaguePoints: 0 };

    const idsRes = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${accData.puuid}/ids?queue=420&start=0&count=20&api_key=${RIOT_API_KEY}`);
    const matchIds = await idsRes.json();
    
    const stats = await Promise.all((matchIds || []).map(async (id) => {
      const d = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${RIOT_API_KEY}`);
      const m = await d.json();
      if (!m.info) return null;
      const p = m.info.participants.find(part => part.puuid === accData.puuid);
      const minutes = m.info.gameDuration / 60;
      return { 
        champion: p.championName, win: p.win, kills: p.kills, deaths: p.deaths, assists: p.assists,
        csPerMin: ((p.totalMinionsKilled + p.neutralMinionsKilled) / (minutes || 1)).toFixed(1),
        visionScore: p.visionScore,
        others: m.info.participants.map(part => ({
          name: part.riotIdGameName || "Anonimo",
          champion: part.championName,
          kda: `${part.kills}/${part.deaths}/${part.assists}`
        }))
      };
    }));

    res.status(200).json({ 
      gameName: accData.gameName, rank: `${soloQ.tier} ${soloQ.rank}`,
      lp: soloQ.leaguePoints, wins: soloQ.wins, losses: soloQ.losses, stats: stats.filter(s => s) 
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
}
