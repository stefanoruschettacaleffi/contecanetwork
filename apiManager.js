const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbManager = require('./contecaDB');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();


/*--- Concentrators ---*/

router.get('/concentrators', function(req, res) {
    dbManager.getAllConcentrators(function (err, concentrators) {
        if(!err){
            res.json(concentrators);
        }
    });
});

router.get('/concentrators/:concentrator_id', function(req, res){
    dbManager.getConcentratorWithId(req.params.concentrator_id, function(err, concentrator) {
       if(!err){
           res.json(concentrator);
       }
    });
});

router.get('/concentrators/:concentrator_id/conteca', function(req, res){
    dbManager.getAllContecasRelatedToConcentrator(req.params.concentrator_id, function(err, conteca) {
        if(!err){
            res.json(conteca);
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
   dbManager.updateContecaWithId(req.params.conteca_id, function(err, result){
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