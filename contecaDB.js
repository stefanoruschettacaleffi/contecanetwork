var mongoose = require('mongoose');

const DBHost = 'mongodb://localhost/contecanetwork';

//Create DB Connection

function connectToDB() {

    mongoose.connect(DBHost);

    //DB notifications

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("connection to DB successfull");
    });
}

//Schemas

var measureSchema = mongoose.Schema({
    timestamp: String,
    energy: String,
    volume: String,
    power: String,
    volume_flow: String,
    flow_temperature: String,
    return_temperature: String,
    volume_1: String,
    volume_2: String,
    volume_3: String,
    volume_4: String,
    energy_1: String
});


var Measure = mongoose.model("Measure", measureSchema);

//TODO: Create objects

function createMeasure(energy, volume, power, volume_flow, flow_temperature, return_temperature,
                       volume_1, volume_2, volume_3, volume_4, energy_1){

    var measure = new Measure({ timestamp: Date.now(),
                                energy: energy,
                                volume: volume,
                                power: power,
                                volume_flow: volume_flow,
                                flow_temperature: flow_temperature,
                                return_temperature: return_temperature,
                                volume_1: volume_1,
                                volume_2: volume_2,
                                volume_3: volume_3,
                                volume_4: volume_4,
                                energy_1: energy_1 });

    measure.save(function(err, measure){
        if(err) {
            console.log("error: " + err + "saving" + measure);
        }
    });
}


//TODO: Delete objects

//TODO: Update objects

//TODO: Read objects


//Export functions

module.exports.connectToDB = connectToDB;
module.exports.createMeasure = createMeasure;