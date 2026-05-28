// ... (codice precedente, es: recupero matchIds)

const matchDetails = await Promise.all(matchIds.map(async (matchId) => {
    try {
        const matchDetail = await getMatchDetail(matchId); // La tua funzione API Riot
        
        // Cerchiamo il giocatore nella partita
        const partecipante = matchDetail.info.participants.find(p => p.puuid === account.puuid);
        
        // Se non troviamo il partecipante, restituiamo null per evitare crash
        if (!partecipante) return null;

        // Costruiamo l'oggetto pulito
        return {
            matchId: matchId,
            champion: partecipante.championName,
            win: partecipante.win,
            kills: partecipante.kills,
            deaths: partecipante.deaths,
            assists: partecipante.assists,
            cs: (partecipante.totalMinionsKilled || 0) + (partecipante.neutralMinionsKilled || 0),
            visionScore: partecipante.visionScore,
            durationMinutes: Math.floor(matchDetail.info.gameDuration / 60)
        };
    } catch (error) {
        console.error(`Errore nel recupero del match ${matchId}:`, error);
        return null;
    }
}));

// Filtriamo i null (partite non trovate o errori) e inviamo al frontend
const finalStats = matchDetails.filter(stat => stat !== null);
res.status(200).json(finalStats);
