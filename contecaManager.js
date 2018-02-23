const net = require('net');
const mbus = require('./mbus');
const MBusFrame = require('./MBusFrame');

const contecaDB = require('./contecaDB');

var server = null;

module.exports = {

    listeningPort : null,

    createServer : function(listeningPort) {

        //Net connection
        this.listeningPort = listeningPort;

        server = net.createServer();
        server.on('connection', handleConnection);

        server.listen (this.listeningPort, function(){
            console.log("server listening to: %j", server.address());
        });

        //DB connection

        contecaDB.connectToDB();
    }
};


function handleConnection(conn){

    //Connection configuration

    var remoteAddress = conn.remoteAddress + ":" + conn.remotePort;

    conn.setEncoding("hex");

    conn.on("data", onConnData);
    conn.on("close", onConnClose);
    conn.on("err", onConnErr);

    function onConnData(data) {

        if (mbus.MBusStatus === mbus.MBusStatusEnum.waitingForAck && data === "e5") {

            console.log("Ack received for: " + mbus.currentPrimaryAddress);
            console.log("Sending data request to: " + mbus.currentPrimaryAddress);

            mbus.MBusStatus = mbus.MBusStatusEnum.waitingForData;

            conn.write(mbus.dataForPrimaryAddress(mbus.currentPrimaryAddress), "hex");
        }
        else if (mbus.MBusStatus === mbus.MBusStatusEnum.waitingForData) {
            console.log("Data received for: " + mbus.currentPrimaryAddress);
            console.log("Data: " + data);

            if (mbus.checkResponseValidity(data)) {
                var frame = new MBusFrame(data);
                console.log(frame);
            }
            else {
                console.log("invalid response");
            }
            conn.destroy();
        }
    }

    function onConnClose(){
        console.log("Connection close");
    }

    function onConnErr(err) {
        console.log("Connection error: " + err);
    }

    //Data
    console.log("New client connection from: " + remoteAddress);

    mbus.currentPrimaryAddress = "01";
    mbus.MBusStatus = mbus.MBusStatusEnum.waitingForAck;

    conn.write( mbus.ackForPrimaryAddress(mbus.currentPrimaryAddress), "hex");
}
