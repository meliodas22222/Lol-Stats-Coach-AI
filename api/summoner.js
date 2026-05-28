export default async function handler(req, res) {
  const { name, tag } = req.query;
  const RIOT_API_KEY = "RGAPI-74c81461-9529-4e37-bd43-1090864f80d1"; // INSERISCI QUI LA TUA CHIAVE

  if (!name || !tag) return res.status(400).json({ error: "Nome e Tag mancanti" });

  try {
    // 1. Ottieni PUUID
    const accountRes = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?api_key=${RIOT_API_KEY}`);
    const accountData = await accountRes.json();
    if (!accountData.puuid) return res.status(404).json({ error: "Giocatore non trovato" });

    // 2. Ottieni ultimi 5 match IDs
    const idsRes = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${accountData.puuid}/ids?start=0&count=5&api_key=${RIOT_API_KEY}`);
    const matchIds = await idsRes.json();

    // 3. Ottieni i dettagli di OGNI partita
    const matchDetails = await Promise.all(
      matchIds.map(async (id) => {
        const res = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${RIOT_API_KEY}`);
        return await res.json();
      })
    );

    // 4. Rispondi al frontend
    return res.status(200).json({
      account: { puuid: accountData.puuid },
      rankedMatches: matchDetails
    });

  } catch (error) {
    return res.status(500).json({ error: "Errore durante il recupero dei dati" });
  }
}
