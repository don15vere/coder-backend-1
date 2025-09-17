const socket = io();
const $log = document.getElementById('chat-log');
const $form = document.getElementById('chat-form');
const $user = document.getElementById('chat-user');
const $text = document.getElementById('chat-text');

function pushLine({ user, text }) {
  const time = new Date().toLocaleTimeString();
  const line = document.createElement('div');
  line.innerHTML = `<span class="muted">${time}</span> <strong>${user ?? 'anon'}</strong>: ${text ?? ''}`;
  $log.appendChild(line);
  $log.scrollTop = $log.scrollHeight;
}

$form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const payload = { user: $user.value.trim() || 'anon', text: $text.value.trim() };
  if (!payload.text) return;
  socket.emit('chat:message', payload);
  $text.value = '';
});

socket.on('chat:message', pushLine);
