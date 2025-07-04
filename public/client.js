const token = localStorage.getItem('token');
if (!token) window.location.href = '/';

fetch('/verify', {
  headers: { 'Authorization': 'Bearer ' + token }
})
  .then(res => res.json())
  .then(data => {
    document.getElementById('bienvenida').innerText = 'Hola, ' + data.user.name;

    const socket = io({
      auth: { token }
    });

    socket.on('usuarios', (users) => {
      document.getElementById('usuarios').innerText = 'Conectados: ' + users.join(', ');
    });

    socket.on('mensaje', (data) => {
      const chat = document.getElementById('chat');
      const burbuja = document.createElement('div');
      burbuja.className = 'burbuja';
      const nombre = document.createElement('span');
      nombre.className = 'nombre';
      nombre.textContent = data.user;
      const mensaje = document.createElement('span');
      mensaje.className = 'mensaje';
      mensaje.textContent = data.msg;
      burbuja.appendChild(nombre);
      burbuja.appendChild(mensaje);
      chat.appendChild(burbuja);
      chat.scrollTop = chat.scrollHeight;
    });

    window.enviar = () => {
      const msg = document.getElementById('mensaje').value;
      if (msg.trim() === '') return;
      socket.emit('mensaje', msg);
      document.getElementById('mensaje').value = '';
    };
  })
  .catch(() => window.location.href = '/');
