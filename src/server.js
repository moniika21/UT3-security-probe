import express from "express";
import path from "path";

const app = express();
const port = 3001;
//const publicPath = "D:\\Documents\\Github\\Université\\UT3-security-probe";
const publicPath = "/home/moniika/UT3";

app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(publicPath, "/src/index.html"));
});

app.listen(port, () => {
  console.log(`API en cours d'exécution sur le port ${port}`);
});
