const dgram = require('dgram');
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const socket = dgram.createSocket('udp4');

socket.on('message', (msg) => {
  if (msg.length >= 18) {
    const opcode = msg.readUInt16LE(8);
    if (opcode === 0x5000) {
      const universe = msg.readUInt16LE(14);
      if (universe === 0) {
        const cm = msg.readUInt16LE(18);
        const inches = msg.readUInt16LE(20);
        
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ cm, inches }));
          }
        });
      }
    }
  }
});

socket.bind(6454);

server.listen(3000, () => {
  console.log('WebSocket server is running on port 3000');
});