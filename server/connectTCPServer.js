const net = require('net');

const multithreadedServerPort = 10002;
const multithreadedServerHost = '127.0.0.1';

function sendToMultithreadedServer(request) {
    return new Promise((resolve, reject) => {
        const tcpClient = new net.Socket();

        tcpClient.connect(multithreadedServerPort, multithreadedServerHost, () => {
            console.log('Connected to multithreaded server');

            // Send data to the multithreaded server
            tcpClient.write(request);
        });

        tcpClient.on('data', (data) => {
            const receivedData = JSON.parse(data.toString());
            console.log('Received from multithreaded server:', receivedData);
            // Resolve the promise with the received data
            resolve(receivedData);
            tcpClient.end(); // Close the connection
        });


        tcpClient.on('error', (error) => {
            console.error('Error connecting to multithreaded server:', error);
            // Reject the promise with the error
            reject(error);
            tcpClient.destroy(); // Destroy the client socket
        });

        tcpClient.on('close', () => {
            console.log('Connection to multithreaded server closed');
            // Handle close event if needed
        });
    });
}
module.exports.sendToMultithreadedServer = sendToMultithreadedServer;
