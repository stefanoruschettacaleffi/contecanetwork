const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbManager = require('./contecaDB');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


/*--- Concentrators ---*/

//Concentrator creation
router.post('/concentrator', function(req, res){
    dbManager.createConcentrator(req.body.name, function(err, concentrator){
        if(!err){
            res.json(concentrator);
        }
    });
});

//Concentrators list
router.get('/concentrator', function(req, res) {
    dbManager.getAllConcentrators(function (err, concentrators) {
        if(!err){
            res.json(concentrators);
        }
    });
});

//Concentrator detail
router.get('/concentrator/:concentrator_id', function(req, res){
    dbManager.getConcentratorWithId(req.params.concentrator_id, function(err, concentrator) {
       if(!err){
           res.json(concentrator);
       }
    });
});

//Conteca list related to a Concentrator
router.get('/concentrator/:concentrator_id/conteca', function(req, res){
    dbManager.getAllContecasRelatedToConcentrator(req.params.concentrator_id, function(err, conteca) {
        if(!err){
            res.json(conteca);
        }
    });
});

//Concentrator update
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

//Create a new Conteca related to a Concentrator
router.post('/concentrator/:concentrator_id/conteca', function(req, res){
    dbManager.createConteca(req.body.primary_address, req.params.concentrator_id, function(err, conteca) {
        if(!err){
            res.json(conteca);
        }
    });
});

//Concentrator deletion
router.delete('/concentrator/:concentrator_id', function(req, res){
    dbManager.deleteConcentratorWithId(req.params.concentrator_id, function(err, result){
        console.log(err);
        if(!err){
            res.json(result);
        }
    });
});


/*--- Conteca ---*/

//Conteca creation
router.post('/conteca', function(req, res){
   dbManager.createConteca(req.body.primary_address, req.body.related_concentrator, function(err, conteca){
      if(!err){
          res.json(conteca);
      }
   });
});

//Conteca list
router.get('/conteca', function(req, res){
   dbManager.getAllConteca(function(err, conteca){
       if(!err){
           res.json(conteca);
       }
   });
});

//Conteca details
router.get('/conteca/:conteca_id', function(req, res){
   dbManager.getContecaWithId(req.params.conteca_id, function(err, result){
       if(!err) {
           res.json(result);
       }
   });
});

//Conteca update
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



//Conteca deletion
router.delete('/conteca/:conteca_id', function(req, res){
    dbManager.deleteContecaWithId(req.params.conteca_id, function(err, result){
        if(!err){
            res.json(result);
        }
    });
});


//Conteca measures
router.get(' conteca/:conteca_id/measure', function(req, res){
    dbManager.getAllMeasuresRelatedToConteca(req.params.conteca_id, function(err, result){
       if(!err){
           res.json(result);
       }
    });
});



/*--- Measure ---*/

//Measures list
router.get('/measure', function(req, res){
   dbManager.getAllMeasures(function(err, measures){
       if(!err) {
           res.json(measures);
       }
   });
});

//Measure details
router.get('/measure/:measure_id', function(req, res){
    dbManager.getMeasureWithId(req.params.measure_id, function(err, measure){
        if(!err) {
            res.json(measure);
        }
    });
});


//Measure update
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

//Measure deletion
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