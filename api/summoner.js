export default async function handler(req, res) {
  const { name, tag } = req.query;
  const apiKey = process.env.VITE_RIOT_API_KEY;

  try {
    const accRes = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
      headers: { "X-Riot-Token": apiKey }
    });
    if (!accRes.ok) return res.status(200).json({ error: "Account non trovato (" + accRes.status + ")" });
    const account = await accRes.json();

    const sumRes = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`, {
      headers: { "X-Riot-Token": apiKey }
    });
    if (!sumRes.ok) return res.status(200).json({ error: "Summoner non trovato" });
    const summoner = await sumRes.json();

    const rankRes = await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`, {
      headers: { "X-Riot-Token": apiKey }
    });
    const rank = await rankRes.json();

    return res.status(200).json({ ...account, ...summoner, rankData: rank });
  } catch (error) {
    return res.status(200).json({ error: "Errore interno server" });
  }
}
