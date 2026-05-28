// Aggiungi questo nel tuo file api/summoner.js
// All'interno del loop delle partite, assicurati di estrarre:
const partecipante = matchDetail.info.participants.find(p => p.puuid === account.puuid);
const stats = {
  champion: partecipante.championName,
  win: partecipante.win,
  kills: partecipante.kills,
  deaths: partecipante.deaths,
  assists: partecipante.assists,
  cs: partecipante.totalMinionsKilled + partecipante.neutralMinionsKilled,
  visionScore: partecipante.visionScore,
  durationMinutes: matchDetail.info.gameDuration / 60
};
// Poi passa questo oggetto `stats` al frontend
