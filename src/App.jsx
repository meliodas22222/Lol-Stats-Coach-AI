import React, { useState } from 'react';
import { Search, Trophy, BrainCircuit, Loader2 } from 'lucide-react';

export default function App() {
  const [summonerName, setSummonerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSearch = async () => {
    if (!summonerName) return;
    setLoading(true);
    
    try {
      // Esegue la chiamata all'API di Riot usando la variabile d'ambiente sicura
      const response = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${import.meta.env.VITE_RIOT_API_KEY}`);
      
      if (!response.ok) {
        throw new Error("Errore nella chiamata API. Verifica la chiave.");
      }
      
      const data = await response.json();
      console.log("Dati ricevuti:", data); 
      alert("Evocatore trovato! Controlla la console (F12) per i dettagli.");
    } catch (error) {
      console.error("Errore:", error);
      alert("Errore: impossibile recuperare i dati. Assicurati che la chiave API sia valida e non scaduta.");
    } finally {
      setLoading(false);
    }
  };

  const handleCoach = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 3000); // Simulazione analisi AI
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-blue-500 mb-2">LoL Stat Coach AI</h1>
        <p className="text-slate-400">Analisi avanzata Season 2026</p>
      </header>

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Nome Evocatore #Tag"
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
            value={summonerName}
            onChange={(e) => setSummonerName(e.target.value)}
          />
          <button 
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-bold flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
            Cerca
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="text-yellow-500" /> Partite Recenti
            </h2>
          </div>
          <div className="space-y-4">
            {[1, 2].map((match) => (
              <div key={match} className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex justify-between items-center">
                <div>
                  <p className="font-bold">Vittoria - 15/2/10</p>
                  <p className="text-sm text-slate-400">CS: 8.2/min | Win Rate: 65%</p>
                </div>
                <button 
                  onClick={handleCoach}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                >
                  {analyzing ? <Loader2 className="animate-spin" size={16} /> : <BrainCircuit size={16} />}
                  Analizza con AI
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
