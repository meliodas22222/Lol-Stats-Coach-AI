export default async function handler(req, res) {
  // Questa funzione risponde con un messaggio di conferma
  // se viene chiamata correttamente
  res.status(200).json({ 
    message: "L'API funziona correttamente!",
    received: req.query 
  });
}
