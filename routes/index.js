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

// Connects to MongoDB server
mongoose.connect(dbUrl , (err) => {
  console.log("mongodb connected",err);
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/add-session', (req, res) => {
  // Create a new session and save to the database
  const pinFilter = {gamePIN: req.body.gamePIN};
  Session.findOne(pinFilter, function(err,doc) { 
    console.log("FOUND DOC:", doc)
    if(err) {
      res.sendStatus(500);
    } else {
      if (doc) {
        res.sendStatus(200);
      } else {
        var session = new Session(req.body);
        session.save((err) =>{
            if(err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        })
      }   
    }
  })
})



router.get('/get-tags', (req, res)=>{
  QuizsetTag.find({}, (err, doc)=>{
    console.log("tags " + doc)
    if(doc) {
      res.send(doc)
    }
    
  })
});

module.exports = router;
