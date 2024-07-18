import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import ArtNet from 'artnet';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const artnet = ArtNet({ host: '0.0.0.0', port: 6454 });

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');

  artnet.on('artnet', (data) => {
    const cm = data[0] + (data[1] << 8);
    const inches = data[2] + (data[3] << 8);
    ws.send(JSON.stringify({ distanceInCm: cm, distanceInInches: inches }));
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});