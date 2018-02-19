const net = require('net');
/*
var server = net.createServer(function(socket) {

   var connection_in = socket.remoteAddress + ":" + socket.remotePort;
   console.log("Connection received: " + connection_in);

});

server.listen(8989);
*/

const PORT = 8989;

let server = net.createServer(onClientConnected);
server.listen(PORT);

function onClientConnected(socket) {

    socket.setEncoding('hex');

    let clientName = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log('New client: ' + clientName);

    socket.on('data', (data) => {

        let m = data.toString().replace(/[\n\r]*$/, '');

        // Logging the message on the server
        console.log(`${clientName} said: ${m}`);
        socket.destroy();
    });

    socket.write("1040014116","hex");
}

console.log(`Server started on port: ${PORT}`);