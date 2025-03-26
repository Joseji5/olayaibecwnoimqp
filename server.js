const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

const velocidad = 5;
const jugadores = {};

io.on("connection", (socket) => {
    console.log("Nuevo jugador conectado:", socket.id);

    // Asignar un color al jugador (blanco o negro)
    let color = Object.values(jugadores).filter(j => j.color === "white").length > Object.values(jugadores).filter(j => j.color === "black").length ? "black" : "white";

    // Agregar nuevo jugador
    jugadores[socket.id] = {
        x: Math.random() * 800 + 100,
        y: Math.random() * 500 + 100,
        color: color
    };

    // Recibir movimiento del jugador
    socket.on("movimiento", (teclas) => {
        let jugador = jugadores[socket.id];
        if (!jugador) return;

        if (teclas["w"] && jugador.y > 20) jugador.y -= velocidad;
        if (teclas["s"] && jugador.y < 580) jugador.y += velocidad;
        if (teclas["a"] && jugador.x > 20) jugador.x -= velocidad;
        if (teclas["d"] && jugador.x < 780) jugador.x += velocidad;
    });

    // Cuando un jugador se desconecta
    socket.on("disconnect", () => {
        console.log("Jugador desconectado:", socket.id);
        delete jugadores[socket.id];
    });
});

// Enviar estado de jugadores cada 30ms
setInterval(() => {
    io.emit("estadoJugadores", jugadores);
}, 30);

server.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});
