import { LowSync, JSONFileSync } from "lowdb";
import { join } from "path";
import express from "express";

const app = express();
const port = 3000;

// Initialisation de la base de données avec le fichier JSON
const filename = join(process.cwd(), "db.json");
const db = new LowSync(new JSONFileSync(filename));

app.use(express.json());

// Middleware d'authentification
function authenticate(req, res, next) {
  const token = req.header("Authorization");
  if (!token || token !== "test") {
    return res.status(401).send("Accès non autorisé.");
  }
  next();
}

// Endpoint pour obtenir l'état de la sonde
//date -u +"%Y-%m-%dT%H:%M:%SZ"
/*
{
    "probe": {
        "ipAddress": "192.168.0.1",
        "status": "online",
        "lastUpdate": "2023-06-25T12:30:00Z" 
    }
}
*/
app.get("/api/probe/status", authenticate, (req, res) => {
  db.read();
  res.json(db.data.probe);
});

// Endpoint pour mettre à jour l'état de la sonde
app.post("/api/probe/update", authenticate, (req, res) => {
  const updatedProbe = req.body.probe;
  db.read();
  db.data = updatedProbe;
  db.write();
  res.send("L'état de la sonde a été mis à jour avec succès.");
});

app.get('/api/data', (req, res) => {
  const data = db.getState();
  res.json(data);
});

app.listen(port, () => {
  console.log(`API en cours d'exécution sur le port ${port}`);
});
