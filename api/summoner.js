export default async function handler(req, res) {
  const { name, tag } = req.query;
  const RIOT_API_KEY = "RGAPI-74c81461-9529-4e37-bd43-1090864f80d1"; // Sostituisci con la tua chiave

  if (!name || !tag) {
    return res.status(400).json({ error: "Nome e Tag mancanti" });
  }

  try {
    // 1. Ottieni il PUUID dal nome e tag
    const accountResponse = await fetch(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?api_key=${RIOT_API_KEY}`
    );
    const accountData = await accountResponse.json();
    
    if (!accountData.puuid) {
      return res.status(404).json({ error: "Giocatore non trovato" });
    }

    // 2. Ottieni la lista delle ultime 5 partite (IDs)
    const matchesResponse = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${accountData.puuid}/ids?start=0&count=5&api_key=${RIOT_API_KEY}`
    );
    const matches = await matchesResponse.json();

    // 3. Rispondi al sito con i dati
    return res.status(200).json({
      name: name,
      puuid: accountData.puuid,
      matches: matches
    });

  } catch (error) {
    return res.status(500).json({ error: "Errore durante la chiamata a Riot" });
  }
