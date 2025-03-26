const socket = io();
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const velocidad = 5;
let jugadores = {}; 

// Escuchar jugadores desde el servidor
socket.on("estadoJugadores", (data) => {
    jugadores = data;
});

// Capturar teclas presionadas
let teclas = {};
document.addEventListener("keydown", (e) => teclas[e.key] = true);
document.addEventListener("keyup", (e) => teclas[e.key] = false);

// Enviar movimientos al servidor
function enviarMovimiento() {
    socket.emit("movimiento", teclas);
    requestAnimationFrame(enviarMovimiento);
}

// Dibujar los jugadores
function renderizar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let id in jugadores) {
        let jugador = jugadores[id];
        ctx.fillStyle = jugador.color;
        ctx.beginPath();
        ctx.arc(jugador.x, jugador.y, 20, 0, Math.PI * 2);
        ctx.fill();
    }

    requestAnimationFrame(renderizar);
}

enviarMovimiento();
renderizar();
