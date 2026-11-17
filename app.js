const http = require("node:http");
const { WebSocketServer } = require("ws");
const express = require("express");
const path = require("node:path");
const tasksRouter = require("./routes/tasks.routes");
const tasksRepository = require("./repositories/tasks.repository");
const app = express();
const PORT = 3000;
app.use(express.json()); // sert à 
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.json({ message: "API ToDo opérationnelle" });
});

function attendre(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get("/demo/async", async (req, res) => {
  try {
    await attendre(1500);
    const tasks = await tasksRepository.getAllTasks();
    res.json({ message: "Opération terminée", tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.use("/tasks", tasksRouter);
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
require("./tempsReel").definirServeurWebSocket(wss);

wss.on("connection", (ws) => {
  console.log("Client WebSocket connecté");
  ws.on("message", (message) => {
    console.log(`Message reçu: ${message}`);
  });
});

server.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
