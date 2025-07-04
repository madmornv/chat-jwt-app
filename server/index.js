const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { login, authenticateToken } = require('./auth');
const { usuariosConectados, agregarUsuario, quitarUsuario } = require('./users');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ruta para login
app.post('/login', login);

// Middleware para proteger rutas
app.get('/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Socket.io autenticado
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Sin token'));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(new Error('Token inválido'));
    socket.user = user;
    next();
  });
});

io.on('connection', (socket) => {
  console.log(`✅ ${socket.user.name} conectado`);
  agregarUsuario(socket.user.name, socket.id);

  io.emit('usuarios', usuariosConectados());

  socket.on('mensaje', (msg) => {
    io.emit('mensaje', { user: socket.user.name, msg });
  });

  socket.on('disconnect', () => {
    console.log(`❌ ${socket.user.name} desconectado`);
    quitarUsuario(socket.user.name);
    io.emit('usuarios', usuariosConectados());
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
