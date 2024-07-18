import express from 'express';
import { createServer } from 'http';
import { WebSocketServer , WebSocket} from 'ws';
import {ArtNetServer} from './artnet.js';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const artnetServer = new ArtNetServer()
artnetServer.listen(6454); // Art-Netのデフォルトポート

artnetServer.on('data', (data) => {
  // console.log('Received Art-Net packet:');
  // console.log('  Universe:', data.universe);
  // console.log('  Sequence:', data.sequence);
  // console.log('  Physical:', data.physical);
  // console.log('  Data:', data.data);

  const cm = data.data[0] + (data.data[1] << 8);
  const inches = data.data[2] + (data.data[3] << 8);
  
  // console.log('  Parsed data:');
  // console.log('    Distance (cm):', cm);
  // console.log('    Distance (inches):', inches);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ distanceInCm: cm, distanceInInches: inches }));
      console.log('Sent data to WebSocket client');
    }
  });
});

artnetServer.on('listening', () => {
  console.log('Art-Net server listening on port 6454');
});

artnetServer.on('error', (error) => {
  console.error('Art-Net server error:', error);
});

server.listen(8080, () => {
  console.log('WebSocket server is running on http://localhost:8080');
});