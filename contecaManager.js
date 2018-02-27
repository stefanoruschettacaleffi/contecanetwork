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

    var contecas = null;
    var currentContecaIndex = 0;

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
                saveMeasureOnDBFromData(data);
            }
            else {
                console.log("invalid response");
            }

            if( currentContecaIndex === contecas.length - 1){
                conn.destroy();
            }
            else {
                currentContecaIndex ++;
                startInterrogationOf(contecas[currentContecaIndex]);
            }
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

    contecaDB.getAllContecasRelatedToConcentrator("5a94130c9fb42f74dc8272a7", function(err, results) {
        if (!err) {
            contecas = results;
            startInterrogationOf(contecas[currentContecaIndex]);
        }
    });

    function startInterrogationOf(conteca) {

        mbus.currentPrimaryAddress = conteca.primary_address;

        console.log(conteca);
        mbus.MBusStatus = mbus.MBusStatusEnum.waitingForAck;

        conn.write( mbus.ackForPrimaryAddress(mbus.currentPrimaryAddress), "hex");
    }
}

function saveMeasureOnDBFromData(data) {
    var frame = new MBusFrame(data);

    console.log(frame);

    var energy = (frame.dataBlocks[2]).data;
    var volume = (frame.dataBlocks[3]).data;
    var power = (frame.dataBlocks[4]).data;
    var volume_flow = (frame.dataBlocks[5]).data;
    var flow_temperature = (frame.dataBlocks[6]).data;
    var return_temperature = (frame.dataBlocks[7]).data;
    var volume_1 = (frame.dataBlocks[12]).data;
    var volume_2 = (frame.dataBlocks[13]).data;
    var volume_3 = (frame.dataBlocks[14]).data;
    var volume_4 = (frame.dataBlocks[15]).data;
    var energy_1 = (frame.dataBlocks[16]).data;

    contecaDB.createMeasure(energy, volume, power, volume_flow, flow_temperature, return_temperature,
                            volume_1, volume_2, volume_3, volume_4, energy_1);
}