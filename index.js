const net = require('net');
/*
var server = net.createServer(function(socket) {

   var connection_in = socket.remoteAddress + ":" + socket.remotePort;
   console.log("Connection received: " + connection_in);

});

server.listen(8989);
*/

const PORT = 8989;

var server = net.createServer(function(socket) {

    socket.setEncoding("utf-8");

    socket.write("1040014116", "hex");

    socket.on('data', function(data) {
        console.log('Received: ' + data);
    });
});

server.listen(PORT);


/*
var server = net.createServer(handleConnection);

//server.on('connection', handleConnection);

server.listen(PORT, function(){
    console.log(`Server started on port: ${PORT}`);
});


function handleConnection(conn) {

    var remote_address = conn.remoteAddress + ":" + conn.remotePort;

    console.log("new client connection from :" + remote_address);

    conn.setEncoding('hex');

    conn.on("data", handleConnData);
    conn.on("close", handleConnClose);
    conn.on("error", handleConnError);

    conn.write("1040014116", 'hex');

    function handleConnData(data) {
        console.log("Data received: " + data);
        conn.destroy();
    }

    function handleConnClose(){
        console.log("Connection close.");
    }

    function handleConnError(err){
        console.log("connection error " + err);
    }
}*/