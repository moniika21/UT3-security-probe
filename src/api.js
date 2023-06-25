import { LowSync, JSONFileSync } from "lowdb";
import { join } from "path";
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

// Initialisation de la base de données avec le fichier JSON
const filename = join(process.cwd(), "db.json");
const db = new LowSync(new JSONFileSync(filename));
db.read();
if (db.data.probes === undefined) {
  db.data.probes = db.data.probes || [];
  db.write();
}
app.use(cors());
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

// {
//     "probes": [{
//         "ip": "192.168.0.1",
//         "status": "online",
//         "timestamp": "2023-06-25T12:30:00Z"
//     }]
// }

app.get("/probes", authenticate, (req, res) => {
  db.read();
  const probes = db.data.probes.sort((a, b) => b.timestamp - a.timestamp);
  res.json(probes);
});

// Endpoint pour mettre à jour l'état de la sonde
app.post("/probes", authenticate, (req, res) => {
  const probe = req.body;
  probe.timestamp = Date.now();
  db.read();
  db.data.probes = db.data.probes.concat(probe);
  db.write();
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`API en cours d'exécution sur le port ${port}`);
});
