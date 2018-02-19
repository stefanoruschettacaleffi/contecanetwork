const net = require('net');

var server = net.createServer(function(socket) {

   var connection_in = socket.remoteAddress + ":" + socket.remotePort;
   console.log("Connection received: " + connection_in);

});

server.listen(8989);