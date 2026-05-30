export default async function handler(req, res) {
  const { name, tag } = req.query;
  const RIOT_API_KEY = "RGAPI-f7e8628a-9a64-4c87-8e8c-24c8cba88ae8";

  try {
    const acc = await (await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?api_key=${RIOT_API_KEY}`)).json();
    const sum = await (await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${acc.puuid}?api_key=${RIOT_API_KEY}`)).json();
    const league = await (await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${sum.id}?api_key=${RIOT_API_KEY}`)).json();
    
    const soloQ = (Array.isArray(league) ? league : []).find(e => e.queueType === "RANKED_SOLO_5x5") || { tier: "Unranked", rank: "", leaguePoints: 0, wins: 0, losses: 0 };
    const matchIds = await (await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${acc.puuid}/ids?queue=420&start=0&count=20&api_key=${RIOT_API_KEY}`)).json();
    
    const stats = await Promise.all((matchIds || []).map(async (id) => {
      const m = await (await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${RIOT_API_KEY}`)).json();
      if (!m.info) return null;
      const p = m.info.participants.find(part => part.puuid === acc.puuid);
      const team1 = m.info.participants.filter(part => part.teamId === 100);
      const team2 = m.info.participants.filter(part => part.teamId === 200);
      
      return {
        champion: p.championName, win: p.win, kills: p.kills, deaths: p.deaths, assists: p.assists,
        duration: Math.floor(m.info.gameDuration / 60),
        teamKills: p.teamId === 100 ? team1.reduce((a, b) => a + b.kills, 0) : team2.reduce((a, b) => a + b.kills, 0),
        enemyKills: p.teamId === 100 ? team2.reduce((a, b) => a + b.kills, 0) : team1.reduce((a, b) => a + b.kills, 0),
        players: m.info.participants.map(part => ({ name: part.riotIdGameName, champ: part.championName, kda: `${part.kills}/${part.deaths}/${part.assists}`, team: part.teamId }))
      };
    }));

    res.status(200).json({ gameName: acc.gameName, rank: soloQ.tier, division: soloQ.rank, lp: soloQ.leaguePoints, wins: soloQ.wins, losses: soloQ.losses, stats });
  } catch (e) { res.status(500).json({ error: e.message }); }
}
