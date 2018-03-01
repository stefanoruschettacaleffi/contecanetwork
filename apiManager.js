const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbManager = require('./contecaDB');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();


/*--- Concentrators ---*/

router.get('/concentrator', function(req, res) {
    dbManager.getAllConcentrators(function (err, concentrators) {
        if(!err){
            res.json(concentrators);
        }
    });
});

router.get('/concentrator/:concentrator_id', function(req, res){
    dbManager.getConcentratorWithId(req.params.concentrator_id, function(err, concentrator) {
       if(!err){
           res.json(concentrator);
       }
    });
});

router.get('/concentrator/:concentrator_id/conteca', function(req, res){
    dbManager.getAllContecasRelatedToConcentrator(req.params.concentrator_id, function(err, conteca) {
        if(!err){
            res.json(conteca);
        }
    });
});

router.put('/concentrator/:concentrator_id', function(req, res){

    dbManager.updateConcentratorWithId(req.params.concentrator_id, req.body.name, function(err, result){
        if(!err){
            res.json(result);
        }
        else{
            console.log("error: " + err);
        }
    });
});

router.delete('concentrator/:concentrator_id', function(req, res){
    dbManager.deleteConcentratorWithId(req.params.concentrator_id, function(err, result){
        if(!err){
            res.json(result);
        }
    });
});



/*--- Conteca ---*/

router.get('/conteca', function(req, res){
   dbManager.getAllConteca(function(err, conteca){
       if(!err){
           res.json(conteca);
       }
   });
});

router.get('/conteca/:conteca_id', function(req, res){
   dbManager.getContecaWithId(req.params.conteca_id, function(err, result){
       if(!err) {
           res.json(result);
       }
   });
});

router.put('/conteca/:conteca_id', function(req, res){

   dbManager.updateContecaWithId(req.params.conteca_id, req.body.primary_address, function(err, result){
       if(!err){
           res.json(result);
       }
       else{
           console.log("error: " + err);
       }
   });
});

router.delete('conteca/:conteca_id', function(req, res){
    dbManager.deleteContecaWithId(req.params.conteca_id, function(err, result){
        if(!err){
            res.json(result);
        }
    });
});



/*--- Measure ---*/

router.get('/measure', function(req, res){
   dbManager.getAllMeasures(function(err, measures){
       if(!err) {
           res.json(measures);
       }
   });
});

router.get('/measure/:measure_id', function(req, res){
    dbManager.getMeasureWithId(req.params.measure_id, function(err, measure){
        if(!err) {
            res.json(measure);
        }
    });
});

router.put('/measure/:measure_id', function(req, res){

    var params = {};

    if(req.body.timestamp) params.timestamp = req.body.timestamp;
    if(req.body.energy) params.energy = req.body.energy;
    if(req.body.volume) params.volume = req.body.volume;
    if(req.body.power) params.power = req.body.power;
    if(req.body.volume_flow) params.volume_flow = req.body.volume_flow;
    if(req.body.flow_temperature) params.flow_temperature = req.body.flow_temperature;
    if(req.body.volume_1) params.volume_1 = req.body.volume_1;
    if(req.body.volume_2) params.volume_2 = req.body.volume_2;
    if(req.body.volume_3) params.volume_3 = req.body.volume_3;
    if(req.body.volume_4) params.volume_4 = req.body.volume_4;
    if(req.body.energy_1) params.energy_1 = req.body.energy_1;
    if(req.body.related_conteca) params.related_conteca = req.body.related_conteca;

    dbManager.updateMeasureWithId( req.params.measure_id, params, function(err, result){
        if(!err){
            res.json(result);
        }
    });
});


router.delete('/measure/:measure_id', function(req, res) {
    dbManager.deleteMeasureWithId(req.params.measure_id, function(err, result){
        if(!err){
            res.json(result);
        }
    });
});

app.use('/api', router);

function startAPIService(port) {
    app.listen(port);
    console.log("Api service started on port: " + port);
}

module.exports.startAPIService = startAPIService;