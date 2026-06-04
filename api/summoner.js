export default async function handler(req, res) {
  const { name, tag } = req.query;
  const RIOT_API_KEY = "RGAPI-aa2300c6-b765-4346-a8fd-fc33bc816efe";

  try {
    const acc = await (await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?api_key=${RIOT_API_KEY}`)).json();
    const sum = await (await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${acc.puuid}?api_key=${RIOT_API_KEY}`)).json();
    
    // Recupero il rank
    const leagueData = await (await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${sum.id}?api_key=${RIOT_API_KEY}`)).json();
    
    // Log per debug su Vercel (controlla i logs se ancora non vedi il rank)
    console.log("League Data ricevuti da Riot:", leagueData);

    // Cerchiamo il rank: prioritizziamo SoloQ, altrimenti prendiamo il primo dato disponibile
    let rankInfo = Array.isArray(leagueData) ? leagueData.find(e => e.queueType === "RANKED_SOLO_5x5") : null;
    if (!rankInfo && Array.isArray(leagueData) && leagueData.length > 0) rankInfo = leagueData[0];

    const matchIds = await (await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${acc.puuid}/ids?queue=420&start=0&count=15&api_key=${RIOT_API_KEY}`)).json();
    
    const matches = await Promise.all(matchIds.map(async (id) => {
      const m = await (await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${RIOT_API_KEY}`)).json();
      if (!m.info) return null;
      const p = m.info.participants.find(part => part.puuid === acc.puuid);
      
      return {
        champion: p.championName,
        win: p.win,
        kills: p.kills, deaths: p.deaths, assists: p.assists,
        damage: p.totalDamageDealtToChampions,
        duration: Math.floor(m.info.gameDuration / 60),
        allPlayers: m.info.participants.map(part => ({
          name: part.riotIdGameName,
          champ: part.championName,
          kda: `${part.kills}/${part.deaths}/${part.assists}`,
          team: part.teamId
        }))
      };
    }));

    res.status(200).json({ 
      gameName: acc.gameName, 
      rank: rankInfo ? rankInfo.tier : "Unranked", 
      division: rankInfo ? rankInfo.rank : "", 
      matches 
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
}
