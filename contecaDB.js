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




//TODO: Create objects

//TODO: Delete objects

//TODO: Update objects

//TODO: Read objects


//Export functions

module.exports.connectToDB = connectToDB();