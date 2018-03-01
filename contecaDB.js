var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;

const DBHost = 'mongodb://localhost/contecanetwork';

//Create DB Connection

function connectToDB() {

    mongoose.connect(DBHost);

    //DB notifications

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("connection to DB successful");
        createDummyDB();
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
    energy_1: String,
    related_conteca: { type: Schema.Types.ObjectId, ref: 'Conteca' }
});

var contecaSchema = mongoose.Schema({
    primary_address: String,
    related_concentrator: { type: Schema.Types.ObjectId, ref: 'Concentrator' }
});

var concentratorSchema = mongoose.Schema({
    name: String
});

var Measure = mongoose.model("Measure", measureSchema);
var Conteca = mongoose.model("Conteca", contecaSchema);
var Concentrator = mongoose.model("Concentrator", concentratorSchema);


//Object creation

function createMeasure(energy, volume, power, volume_flow, flow_temperature, return_temperature,
                       volume_1, volume_2, volume_3, volume_4, energy_1, related_conteca){

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
                                energy_1: energy_1,
                                related_conteca: related_conteca});

    measure.save(function(err, measure) {
        if(err) {
            console.log("error: " + err + "saving" + measure);
        }
        else {
            console.log("Measure: " + measure + "correctly saved on DB.");
        }
    });

    return measure;
}


function createConcentrator(name) {
    var concentrator = new Concentrator({name: name});

    concentrator.save(function(err, concentrator) {
        if (err) {
            console.log("error: " + err + "saving" + concentrator);
        }
        else {
            console.log("Concentrator: " + concentrator + "correctly saved on DB.");
        }
    });

    return concentrator;
}

function createConteca(primary_address, related_concentrator) {
    var conteca = new Conteca({ primary_address:primary_address,
                                related_concentrator: related_concentrator});

    conteca.save(function(err, conteca) {
        if (err) {
            console.log("error: " + err + "saving" + conteca);
        }
        else {
            console.log("Conteca: " + conteca + "correctly saved on DB.");
        }
    });

    return conteca;
}



function createDummyDB() {
    //Find concentrators
    Concentrator.findOne(function(err, result){
        if (!err) {
            if(result == null){
                var concentrator =  createConcentrator("Test concentrator");
                createConteca("01", concentrator.id);
                createConteca("02", concentrator.id);
                createConteca("03", concentrator.id);
                createConteca("05", concentrator.id);
                createConteca("06", concentrator.id);
            }
        }
    });

    //if not concentrator
    //create dummy concentrator with two conteca
}


//TODO: Delete objects

//TODO: Update objects

//TODO: Read objects

function getAllConcentrators(callback) {
    Concentrator.find(function (err, result) {
        callback(err, result);
    })
}

function getConcentratorWithId(concentrator_id, callback){
    Concentrator.find({_id: concentrator_id}, function (err, result){
        callback(err, result);
    });
}

function getAllContecasRelatedToConcentrator(concentrator, callback) {
     Conteca.find({related_concentrator: ObjectId(concentrator)},  function(err, result){
         callback(err, result);
     });
}


//Export functions

module.exports.connectToDB = connectToDB;

module.exports.createMeasure = createMeasure;
module.exports.createConteca = createConteca;
module.exports.createConcentrator = createConcentrator;


module.exports.getAllConcentrators = getAllConcentrators;
module.exports.getConcentratorWithId = getConcentratorWithId;




module.exports.getAllContecasRelatedToConcentrator = getAllContecasRelatedToConcentrator;
