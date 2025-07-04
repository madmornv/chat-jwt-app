let usuarios = {};

function agregarUsuario(nombre, socketId) {
  usuarios[nombre] = socketId;
}

function quitarUsuario(nombre) {
  delete usuarios[nombre];
}

function usuariosConectados() {
  return Object.keys(usuarios);
}

module.exports = { agregarUsuario, quitarUsuario, usuariosConectados };
