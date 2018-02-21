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

    conn.write("1040014116", "hex");

    function onConnData(data) {
        console.log("Data received: " + data);
    }

    function onConnClose(){
        console.log("Connection close");
    }

    function onConnErr(err) {
        console.log("Connection error: " + err);
    }
}