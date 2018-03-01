const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.use('/api', router);

function startAPIService(port) {
    app.listen(port);
    console.log("Api service started on port: " + port);
}

module.exports.startAPIService = startAPIService;