const net = require('net');
/*
var server = net.createServer(function(socket) {

   var connection_in = socket.remoteAddress + ":" + socket.remotePort;
   console.log("Connection received: " + connection_in);

});

server.listen(8989);
*/

const PORT = 5000;

let server = net.createServer(onClientConnected);
server.listen(PORT);

function onClientConnected(socket) {
    console.log(`New client: ${socket.remoteAddress}:${socket.remotePort}`);
    socket.destroy();
}

console.log(`Server started on port: ${PORT}`);