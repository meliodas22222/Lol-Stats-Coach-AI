export default async function handler(req, res) {
  const { name, tag } = req.query;
  const RIOT_API_KEY = "RGAPI-aa2300c6-b765-4346-a8fd-fc33bc816efe";

  try {
    const acc = await (await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?api_key=${RIOT_API_KEY}`)).json();
    const sum = await (await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${acc.puuid}?api_key=${RIOT_API_KEY}`)).json();
    
    // TENTATIVO 1: Endpoint standard
    let league = await (await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${sum.id}?api_key=${RIOT_API_KEY}`)).json();
    
    // TENTATIVO 2: Se è vuoto, proviamo l'endpoint "EXP" (più adatto per Master+)
    if (!league || league.length === 0) {
        league = await (await fetch(`https://euw1.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/I?page=1&api_key=${RIOT_API_KEY}`)).json();
        // Nota: questo endpoint è più complesso, stiamo solo cercando di vedere se il dato arriva
    }

    let rankInfo = Array.isArray(league) ? league.find(e => e.summonerId === sum.id) : null;
    
    // Fallback finale se non troviamo nulla
    const rankDisplay = rankInfo ? `${rankInfo.tier} ${rankInfo.rank}` : "Master+ (Dati protetti)";

    const matchIds = await (await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${acc.puuid}/ids?queue=420&start=0&count=15&api_key=${RIOT_API_KEY}`)).json();
    
    const matches = await Promise.all((matchIds || []).map(async (id) => {
      try {
        const m = await (await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${RIOT_API_KEY}`)).json();
        if (!m.info || !m.info.participants) return null;
        
        const p = m.info.participants.find(part => part.puuid === acc.puuid);
        if (!p) return null;

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
      } catch { return null; }
    }));

    res.status(200).json({ 
      gameName: acc.gameName, 
      rank: rankInfo ? rankInfo.tier : "Master+", 
      division: rankInfo ? rankInfo.rank : "", 
      matches: matches.filter(m => m !== null) 
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
}
