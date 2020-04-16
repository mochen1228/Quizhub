var express = require('express');
var router = express.Router();
var path = require("path");

var MongoClient = require('mongodb').MongoClient;
var mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
var bodyParser = require('body-parser')
var dbUrl = 'mongodb+srv://mochen1228:Mochen123!@cluster0-ouxvq.mongodb.net/test?retryWrites=true&w=majority';


var app = express();

var Session = require('../models/models.js').Session;
var Game = require('../models/models.js').Game;
var QuizsetTag = require('../models/models.js').QuizsetTag;
var Quizset = require('../models/models.js').Quizset;
var Player = require('../models/models.js').Player;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


// Create a new game session with quizsetID
// Required params
// quizsetObjectID
//      type: Int
//      This is the ObjectId, which is the ID generated by MongoDB, not quizsetID
router.post('/create-new-session', (req, res) => {
    console.log("create new game ");
    var quizsetObjectID = "";

    // Find the objectid of the quizset that we are going to assign to the session
    const filter = {quizsetID:req.body.quizsetID};
    Quizset.findOne(filter, function(err, doc) {
        if(err) {
            res.sendStatus(500);
        } else {
            quizsetObjectID = doc.id
        }
        var game = new Game({quizset:quizsetObjectID});
        game.save().then(function (obj) {
            console.log("New game pin:", obj.gamePIN);
            res.send({gamePIN: obj.gamePIN});
        });
    })
})


router.post('/add-player', (req, res) => {
// Add player to a game session according to the gamePIN
const pinFilter = {gamePIN: req.body.gamePIN};
    Game.findOne(pinFilter, function(err,game) { 
        // console.log("FOUND DOC:", game)

        var newPlayer = new Player({
        'nickname': req.body.player
        });
        game.players.push(newPlayer)
        game.save((err) => {
            if(err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        })
    });
})

// Getting all game sessions
router.get('/sessions', (req, res) => {
  Game.find({},(err, messages)=> {
      res.send(messages);
  })
})


module.exports = router;