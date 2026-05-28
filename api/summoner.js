import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [data, setData] = useState(null);
  const [errore, setErrore] = useState('');

  // ... (tieni qui le tue funzioni elaboraPartite, calcolaWinRateTotale, calcolaWinRateCampioni come le avevi prima) ...

  const cerca = async () => {
    if (!name || !tag) return;
    setErrore('');
    setData(null); // Reset dati precedenti
    
    try {
      // CHIAMA IL TUO BACKEND, NON RIOT DIRECTLY
      const res = await fetch(`/api/summoner?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
      
      if (!res.ok) throw new Error("Giocatore non trovato o errore server");
      
      const result = await res.json();
      setData(result);
    } catch (err) {
      setErrore("Errore: impossibile recuperare i dati.");
    }
  };

  // ... (tieni qui il resto del return con l'interfaccia grafica) ...
}
