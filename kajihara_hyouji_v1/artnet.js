import util from "util";
import { EventEmitter } from "events";
import dgram from "dgram";

// ArtNet server class
export class ArtNetServer extends EventEmitter {
    listen(port, cb) {
        this.port = port;

        // Set up the socket
        const sock = dgram.createSocket("udp4", (msg, peer) => {
            const data = new Array();
            for (let i = 0; i < msg.length; i++) {
                let d = msg.toString().charCodeAt(i);
                // Since we can't do unsigned 8-bit integers, do some normalization
                if (d < 0) {
                    d = 0;
                } else if (d > 255) {
                    d = 255;
                }

                // Append the byte to the array
                data.push(d);
            }

            // Deseralize the data - magic numbers are as per the Art-Net protocol
            const sequence = data[12];
            const physical = data[13];
            const universe = data[14] * 256 + data[15];
            const length = data[16] * 256 + data[17];

            const rawData = new Array();
            for (let i = 0; i < length; i++) {
                rawData.push(data[i + 18]);
            }

            // Build the associative array to return
            const retData = {
                sequence: sequence,
                physical: physical,
                universe: universe,
                length: length,
                data: rawData,
            };

            // And call the callback passing the deseralized data
            cb?.(retData, peer);
            this.emit('data', retData);
        });
        sock.bind(port);
    };
}
