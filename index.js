const net = require('net');
/*
var server = net.createServer(function(socket) {

   var connection_in = socket.remoteAddress + ":" + socket.remotePort;
   console.log("Connection received: " + connection_in);

});

server.listen(8989);
*/

const PORT = 8989;

let server = net.createServer();

server.on('connection', handleConnection);

server.listen(PORT, function(){
    console.log(`Server started on port: ${PORT}`);
});


function handleConnection(connection) {

    var remote_address = connection.remoteAddress + ":" + connection.remotePort;

    console.log("new client connection from :" + remote_address);

    //connection.setEncoding("hex");

    connection.on("data", handleConnData);
    connection.on("close", handleConnClose);
    connection.on("error", handleConnError);

    function handleConnData(data) {
        console.log("Data received:" + data);
        connection.destroy();
    }

    function handleConnClose(){
        console.log("Connection close.");
    }

    function handleConnError(){
        console.log("connection error");
    }

    //var byteBuffer = new Buffer("1040014116", 'hex');
    connection.write("1040014116","hex");
}