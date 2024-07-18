import { WebSocketServer } from 'ws';
import dgram from 'dgram';

const wss = new WebSocketServer({ port: 3000 });
const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
  const data = {
    cm: (msg[1] << 8) | msg[0],
    inches: (msg[3] << 8) | msg[2]
  };
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocketServer.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
});

udpServer.bind(6454); // Art-Net default port

console.log('WebSocket server running on port 3000');
console.log('UDP server listening on port 6454');