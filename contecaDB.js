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
        //createDummyDB();
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
    serial: String,
    primary_address: String,
    secondary_address: String,
    related_concentrator: { type: Schema.Types.ObjectId, ref: 'Concentrator' }
});

var concentratorSchema = mongoose.Schema({
    name: String,
    serial: String,
    address: String,
    city: String,
    zip: String,
    phone: String,
    sim_apn: String,
    sim_iccid: String
});

var Measure = mongoose.model("Measure", measureSchema);
var Conteca = mongoose.model("Conteca", contecaSchema);
var Concentrator = mongoose.model("Concentrator", concentratorSchema);


concentratorSchema.pre('remove', function(next) {
    Conteca.remove({related_concentrator: this._id}).exec();
    next();
});

contecaSchema.pre('remove', function(next) {
    Measure.remove({related_conteca: this._id}).exec();
    next();
});



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
        //else {
           // console.log("Measure: " + measure + "correctly saved on DB.");
        //}
    });

    return measure;
}


function createConcentrator(name, callback) {
    var concentrator = new Concentrator({name: name});

    concentrator.save(function(err, concentrator) {
        callback(err, concentrator);
    });
}


function createConteca(primary_address, related_concentrator, callback) {
    var conteca = new Conteca({ primary_address:primary_address,
                                related_concentrator: related_concentrator});

    conteca.save(function(err, conteca) {
       callback(err, conteca);
    });
}


/*--- Read ---*/

function getAllConcentrators(callback) {

    Concentrator.find({}, 'name serial address city', function (err, result) {
        callback(err, result);
    })
}

function getConcentratorWithId(concentrator_id, callback){
    Concentrator.find({_id: concentrator_id}, function (err, result){
        callback(err, result[0]);
    });
}

function getAllContecasRelatedToConcentrator(concentrator, callback) {
     Conteca.find({related_concentrator: ObjectId(concentrator)},  function(err, result){
         callback(err, result);
     });
}

function getAllConteca(callback){
    Conteca.find(function(err, result){
       callback(err, result);
    });
}

function getContecaWithId(conteca_id, callback){
    Conteca.find({_id: conteca_id}, function(err, result){
        callback(err, result);
    });
}

function getAllMeasuresRelatedToConteca(conteca, callback) {
    Measure.find({related_conteca: ObjectId(conteca)}, function(err, result){
        callback(err, result);
    })
}

function getAllMeasures(callback){
    Measure.find( function(err, result) {
        callback(err, result);
    });
}

function getMeasureWithId(measure_id, callback){
    Measure.find( {_id: measure_id}, function(err, result){
        callback(err, result)
    });
}

/*--- Object Update ---*/

function updateConcentratorWithId(concentrator_id, name, callback) {
    Concentrator.findOneAndUpdate({_id: concentrator_id}, {$set:{name: name}}, {new: true}, function(err, result){
        callback(err, result);
    });
}

function updateContecaWithId(conteca_id, primary_address, callback) {
    Conteca.findOneAndUpdate({_id: conteca_id}, {$set:{primary_address: primary_address}}, {new: true}, function(err, result){
        callback(err, result);
    });
}

function updateMeasureWithId(measure_id, params_array, callback) {

    Measure.findOneAndUpdate({_id: measure_id}, {$set:params_array}, {new: true}, function(err, result){
        callback(err, result);
    });
}


/*--- Object Deletion ---*/

function deleteConcentratorWithId(concentrator_id, callback) {
    Concentrator.findOneAndRemove({_id: concentrator_id}, function(err, result){
        callback(err, result);
    });
}

function deleteContecaWithId(conteca_id, callback) {
    Conteca.findOneAndRemove({_id: conteca_id}, function(err, result){
        callback(err, result);
    });
}

function deleteMeasureWithId(measure_id, callback) {
    Measure.findOneAndRemove({_id: measure_id}, function(err, result){
        callback(err, result);
    });
}


/*--- Dummy ---*/
/*
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
}
*/

//Export functions

module.exports.connectToDB = connectToDB;

module.exports.createMeasure = createMeasure;
module.exports.createConteca = createConteca;
module.exports.createConcentrator = createConcentrator;

module.exports.getAllConteca = getAllConteca;
module.exports.getAllConcentrators = getAllConcentrators;
module.exports.getAllMeasures = getAllMeasures;
module.exports.getConcentratorWithId = getConcentratorWithId;
module.exports.getContecaWithId = getContecaWithId;
module.exports.getMeasureWithId = getMeasureWithId;
module.exports.getAllMeasuresRelatedToConteca = getAllMeasuresRelatedToConteca;

module.exports.updateConcentratorWithId = updateConcentratorWithId;
module.exports.updateContecaWithId = updateContecaWithId;
module.exports.updateMeasureWithId = updateMeasureWithId;

module.exports.deleteConcentratorWithId = deleteConcentratorWithId;
module.exports.deleteContecaWithId = deleteContecaWithId;
module.exports.deleteMeasureWithId = deleteMeasureWithId;

module.exports.getAllContecasRelatedToConcentrator = getAllContecasRelatedToConcentrator;