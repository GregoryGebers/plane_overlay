const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Client connected');
});

app.post('/send-message', (req, res) => {
  const { message } = req.body;
  if (typeof message === 'string' && message.trim() !== '') {
    io.emit('newMessage', message.trim());
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, error: 'Invalid message' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Overlay server running at http://localhost:${PORT}`);
});
