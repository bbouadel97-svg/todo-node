const { WebSocket } = require("ws");

let wss;

function definirServeurWebSocket(instance) {
  wss = instance;
}

function signalerChangementTaches() {
  if (!wss) {
    throw new Error("Serveur WebSocket non initialisé");
  }

  const message = JSON.stringify({ type: "tasks:changed" });

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

module.exports = { definirServeurWebSocket, signalerChangementTaches };
