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
      chat.innerHTML += `<p><strong>${data.user}:</strong> ${data.msg}</p>`;
    });

    window.enviar = () => {
      const msg = document.getElementById('mensaje').value;
      socket.emit('mensaje', msg);
      document.getElementById('mensaje').value = '';
    };
  })
  .catch(() => window.location.href = '/');
