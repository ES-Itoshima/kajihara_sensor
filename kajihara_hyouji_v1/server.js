const express = require('express');
const http = require('http');
const ArtNet = require('artnet');
const socketIo = require('socket.io');

// Express サーバーの設定
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const artnet = ArtNet({ host: '0.0.0.0', port: 6454 });

io.on('connection', (socket) => {
  console.log('Socket.IO connection established');

  artnet.on('artnet', (data) => {
    const cm = data[0] + (data[1] << 8);
    const inches = data[2] + (data[3] << 8);
    socket.emit('sensorData', { distanceInCm: cm, distanceInInches: inches });
  });

  socket.on('disconnect', () => {
    console.log('Socket.IO connection closed');
  });
});

server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
