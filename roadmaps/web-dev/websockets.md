---
id: websockets
parent: apis-protocoles
label: WebSockets & Temps réel
explored: false
order: 2
---

# WebSockets & Temps réel

WebSocket établit une connexion bidirectionnelle persistante entre le client et le serveur. Idéal pour les chats, les notifications en temps réel, les tableaux de bord live et les jeux.

## WebSocket natif (client)

```javascript
// Connexion
const ws = new WebSocket('wss://api.example.com/ws');

// Avec authentification via query param (pas de headers custom possibles)
const ws = new WebSocket(`wss://api.example.com/ws?token=${encodeURIComponent(token)}`);

ws.addEventListener('open', () => {
  console.log('Connecté');
  ws.send(JSON.stringify({ type: 'subscribe', channel: 'prices' }));
});

ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  switch (message.type) {
    case 'price_update': updatePrice(message.data); break;
    case 'error':        console.error(message.error); break;
  }
});

ws.addEventListener('close', (event) => {
  console.log(`Fermé — code: ${event.code}, raison: ${event.reason}`);
  if (!event.wasClean) scheduleReconnect();  // reconnexion automatique
});

ws.addEventListener('error', (err) => console.error('WS error:', err));

// Fermer proprement
ws.close(1000, 'Déconnexion volontaire');
```

## Reconnexion automatique avec back-off exponentiel

```javascript
class ReconnectingWebSocket {
  #ws = null;
  #reconnectAttempts = 0;
  #maxAttempts = 10;
  #url;
  #handlers = new Map();

  constructor(url) { this.#url = url; this.#connect(); }

  #connect() {
    this.#ws = new WebSocket(this.#url);
    this.#ws.onopen    = ()  => { this.#reconnectAttempts = 0; this.#emit('open'); };
    this.#ws.onmessage = (e) => this.#emit('message', JSON.parse(e.data));
    this.#ws.onclose   = (e) => {
      if (!e.wasClean && this.#reconnectAttempts < this.#maxAttempts) {
        const delay = Math.min(1000 * 2 ** this.#reconnectAttempts, 30000);
        this.#reconnectAttempts++;
        setTimeout(() => this.#connect(), delay);
      }
    };
  }

  send(data) { this.#ws?.send(JSON.stringify(data)); }
  on(event, handler) { this.#handlers.set(event, handler); }
  #emit(event, data) { this.#handlers.get(event)?.(data); }
}
```

## Server-Sent Events (SSE) — unidirectionnel serveur → client

```javascript
// Client — natif, reconnexion automatique
const source = new EventSource('/api/notifications', {
  withCredentials: true,
});

source.onmessage = (e) => console.log('Notif:', JSON.parse(e.data));
source.addEventListener('order-update', (e) => updateOrder(JSON.parse(e.data)));
source.onerror = () => console.warn('SSE reconnexion en cours…');

// Serveur (Node.js)
app.get('/api/notifications', (req, res) => {
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.flushHeaders();

  const send = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const interval = setInterval(() => send('heartbeat', { ts: Date.now() }), 30000);
  emitter.on('order-update', (order) => send('order-update', order));

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});
```

## Socket.IO — WebSocket avec fallbacks et rooms

```javascript
// Serveur
import { Server } from 'socket.io';
const io = new Server(httpServer, { cors: { origin: 'http://localhost:5173' } });

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const user  = verifyToken(token);
  if (!user) return next(new Error('Unauthorized'));
  socket.data.user = user;
  next();
});

io.on('connection', (socket) => {
  const user = socket.data.user;
  socket.join(`user:${user.id}`);      // room privée
  socket.join(`org:${user.orgId}`);    // room partagée

  socket.on('message:send', async ({ roomId, text }) => {
    const msg = await saveMessage({ userId: user.id, roomId, text });
    io.to(`room:${roomId}`).emit('message:new', msg);  // broadcast à la room
  });

  socket.on('disconnect', () => console.log('Déconnecté:', socket.id));
});

// Émettre depuis n'importe où dans l'app
io.to(`user:${userId}`).emit('notification', { type: 'order_shipped', orderId });

// Client
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000', { auth: { token } });
socket.on('message:new', msg => addMessageToUI(msg));
socket.emit('message:send', { roomId: 'general', text: 'Bonjour !' });
```

## Liens

- [MDN — WebSocket](https://developer.mozilla.org/fr/docs/Web/API/WebSocket)
- [MDN — EventSource (SSE)](https://developer.mozilla.org/fr/docs/Web/API/EventSource)
- [Socket.IO](https://socket.io/)
