const net = require('net');
const PORT = 8989;

const server = net.createServer();


server.on('connection', handleConnection);

server.listen(PORT , function(){
    console.log("server listening to: %j", server.address());
});

function handleConnection(conn){

    var remoteAddress = conn.remoteAddress + ":" + conn.remotePort;
    console.log("New client connection from: " + remoteAddress);

    conn.setEncoding("hex");

    conn.on("data", onConnData);
    conn.on("close", onConnClose);
    conn.on("err", onConnErr);

    var byteBuffer = new Buffer("1040014116", 'hex');
    conn.write(byteBuffer);

    function onConnData(data) {
        console.log("Data received: " + data.constructor.name);
    }

    function onConnClose(){
        console.log("Connection close");
    }

    function onConnErr(err) {
        console.log("Connection error: " + err);
    }
}



/*
var server = net.createServer(function(socket) {

   var connection_in = socket.remoteAddress + ":" + socket.remotePort;
   console.log("Connection received: " + connection_in);

});

server.listen(8989);
*/

/*
var server = net.createServer(function (socket) {

    var id = socket.remoteAddress + ': ' + socket.remotePort;

    console.log('Server connected to: ', id);
    socket.setEncoding("hex");

    socket.on('data', function(data) {
        console.log(data);
        console.log("to string:" + data.toString("hex"));
    });

});

server.listen(PORT);
*/
/*
var server = net.createServer(function(socket) {

    socket.setEncoding("hex");

    socket.write("1040014116", "hex");

    socket.on('data', function(data) {
        console.log('Received: ' + data);
    });
});

server.listen(PORT);
*/

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