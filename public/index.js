const socket = new WebSocket("ws://localhost:3000/ws");

// La connexion est ouverte
socket.addEventListener("open", function (event) {
  socket.send("Coucou le serveur !");
});

// Écouter les messages
socket.addEventListener("message", function (event) {
  console.log("Voici un message du serveur", event.data);
});
