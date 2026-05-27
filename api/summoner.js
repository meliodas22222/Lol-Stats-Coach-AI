export default async function handler(req, res) {
  const { name, tag } = req.query;
  const apiKey = process.env.VITE_RIOT_API_KEY;

  try {
    const accRes = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
      headers: { "X-Riot-Token": apiKey }
    });
    const account = await accRes.json();

    const sumRes = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`, {
      headers: { "X-Riot-Token": apiKey }
    });
    const summoner = await sumRes.json();

    // Chiamata per le ultime 5 partite (europe.api è il server corretto per le match history)
    const matchRes = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${account.puuid}/ids?start=0&count=5`, {
      headers: { "X-Riot-Token": apiKey }
    });
    const matchIds = await matchRes.json();

    return res.status(200).json({ account, summoner, matchIds });
  } catch (error) {
    return res.status(500).json({ error: "Errore nel recupero dati" });
  }
}
