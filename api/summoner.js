export default async function handler(req, res) {
  const { name, tag } = req.query;
  const RIOT_API_KEY = "LA_TUA_NUOVA_API_KEY"; // INSERISCI QUI LA TUA CHIAVE

  if (!name || !tag) return res.status(400).json({ error: "Nome e Tag mancanti" });

  try {
    const accountRes = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?api_key=${RIOT_API_KEY}`);
    const accountData = await accountRes.json();
    if (!accountData.puuid) return res.status(404).json({ error: "Giocatore non trovato" });

    const idsRes = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${accountData.puuid}/ids?start=0&count=10&api_key=${RIOT_API_KEY}`);
    const matchIds = await idsRes.json();

    const matchDetails = await Promise.all(
      matchIds.map(async (id) => {
        const detailsRes = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${RIOT_API_KEY}`);
        return await detailsRes.json();
      })
    );

    // Filtriamo solo le partite in SoloQ (queueId: 420)
    const soloQMatches = matchDetails.filter(m => m.info.queueId === 420);

    const stats = soloQMatches.map(match => {
      const player = match.info.participants.find(p => p.puuid === accountData.puuid);
      return {
        champion: player.championName,
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        win: player.win
      };
    });

    const wins = stats.filter(s => s.win).length;
    const winRate = stats.length > 0 ? ((wins / stats.length) * 100).toFixed(1) : 0;

    return res.status(200).json({ 
      gameName: accountData.gameName,
      stats, 
      winRate 
    });
  } catch (error) {
    return res.status(500).json({ error: "Errore interno server" });
  }
}
