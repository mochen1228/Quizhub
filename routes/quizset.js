var express = require('express');
var router = express.Router();
var path = require("path");

var MongoClient = require('mongodb').MongoClient;
var mongoose = require("mongoose");
var bodyParser = require('body-parser')
var dbUrl = 'mongodb+srv://mochen1228:Mochen123!@cluster0-ouxvq.mongodb.net/test?retryWrites=true&w=majority';

var app = express();


var Quiz = require('../models/models.js').Quiz;
var Game = require('../models/models.js').Game;
var Quizset = require('../models/models.js').Quizset;
var QuizsetTag = require('../models/models.js').QuizsetTag;


// Get quizset from database
// Required params: 
// quizsetID: 
//      type: Int
//      quizsetID of the current quizset
router.post("/get-quiz-set", function(req, res) {
    console.log("get-quiz-set " + req.body.quizsetID)

    const filter = {quizsetID:req.body.quizsetID};

    // Preload the quizzes to the result
    // Array of Quiz objects in the quizset
    var quizzes = new Array();

    Quizset.findOne(filter, function(err, quizset) {
        console.log("FOUND DOC:", quizset);
        if(err) {
            res.sendStatus(500);
        } else {
            // Find all the Quiz objects in the quizset using objectIDs
            // in quizset.quizset
            Quiz.find({
                '_id': { $in: quizset.quizset}
            }, function(err, questions){
                 res.send({quizzes: questions, quizset:quizset})
            });
        }
    })
});


// Remove a question from a quizset
// Required params:
// id:
//      type: ObjectId
//      id of the Question object to be deleted
// quizsetID: 
//      type: Int
//      quizsetID of the current quizset
router.post("/delete-question", function(req, res) {
    // console.log("delete-quiz " + req.body.gamePIN)
    console.log("delete-question " + req.body.id)
    
    const filter = {quizsetID: req.body.quizsetID};

    Quizset.findOne(filter, function(err, quizset) {
        if(err) {
            res.sendStatus(500);
        } else {
            // Remove from quizset
            quizset.quizset.remove({_id: req.body.id});
            quizset.save();

            // Remove Question object from database
            Quiz.findOne({_id: req.body.id}).remove().exec()

            // Send the remaining questions back to the page
            Quiz.find({
                '_id': { $in: quizset.quizset}
            }, function(err, questions){
                res.send({quizset: questions})
            });
        }
    })
});

// Add a question to a quizset
// 
router.post('/add-question', (req, res) => {
    console.log("add-question " + req.body.gamePIN)
    console.log("add-question " + req.body.question.id)
    var question = req.body.question;

    Quiz.findById(req.body.question.id, function(err, doc) {
        // Edit or create Question object
        if(doc) {
            // console.log("Question exists, modifing");
            doc.content = question.content;
            doc.answer = question.answer;
            doc.option1 = question.option1;
            doc.option2 = question.option2;
            doc.option3 = question.option3;
            doc.option4 = question.option4;
            doc.time = question.time;
            doc.save();
        } else {
            doc = new Quiz(req.body.question);
            doc.save();
        }

        // Push new Question to Quizset
        var filter = {quizsetID: req.body.quizsetID}
        Quizset.findOne(filter, function(err, set) {
            console.log("QUIZSET FOUND:", set);
            if (set){
                // Avoid duplicates
                if (!set.quizset.includes(doc._id)) {
                    set.quizset.push(doc._id);
                    set.save();
                }
                // Send updated question list back to the page for refresh
                Quiz.find({
                    '_id': { $in: set.quizset}
                }, function(err, docs){                
                    res.send({quizset: docs, id:doc._id});     
                });
            }
            
        })
    })  
})

// Get a single question from databse by id
// Required param:
// id:
//      type: ObjectId
//      id of the Question object
router.post('/get-quiz', (req, res) => {
    console.log("get-quiz " + req.body.id)
    // console.log("add-quiz quiz" + req.body.quiz)
    var idFilter = {_id: req.body.id};
    Quiz.findOne(idFilter, function(err,doc) {
    // console.log("FOUND DOC:", doc);
        if(doc) {
            res.send(doc);
        } else {
            res.sendStatus(500);
        }
    });
})

// TODO:
// Fix this part
router.post('/update-quizset', (req, res) => {
    console.log("update-quizset " + req.body.gamePIN)
    console.log("tag " + req.body.tag)
    var pinFilter = {gamePIN: req.body.gamePIN};
    Game.findOne(pinFilter, function(err, game) {
    // console.log("FOUND DOC:", game);
    if(game) {
        Quizset.findById(game.quizset, function(err, set) {
            console.log("quizset find by id " + set);
            
            if(set) {
                set.name = req.body.name
                set.tag.forEach(element => {
                    QuizsetTag.findOne({tag:element}, function(err, doc) {
                        if(doc) {
                            doc.quizset.remove({_id: set._id});
                            doc.save()
                        }
                    }) 
                });
                set.tag = req.body.tag
                set.save();
            } else {
                set = new Quizset(req.body);
                console.log("newQuizSet " + set._id);
                set.save().then(()=>{
                    game.quizset = set._id;
                    console.log("newQuizSet " + set._id);
                    game.save();
                    console.log("newQuizSet " + game.quizset);  
                })
            }
            set.tag.forEach(element => {
            QuizsetTag.findOne({tag:element}, function(err, doc) {
                if(doc == null) {
                    doc = new QuizsetTag()
                    doc.tag = element
                    console.log("tag name is " + element)
                } 
                doc.quizset.push({_id: set._id});
                doc.save()
            }) 
        })
    });
     
    }
    });
})


//
router.get('/get-all-quizset', (req, res)=>{
    console.log("get-all-quizset")
  
    Quizset.find({}, (err, doc)=>{
      console.log("quizsets " + doc)
      if(doc) {
        res.send(doc)
      }
      
    })
  });

router.post('/get-tag-quizset', (req, res)=>{
console.log("get-tag-quizset " + req.body.tag)

QuizsetTag.findOne({tag: req.body.tag}, (err, doc)=>{
    console.log("quizsets " + doc)
    if(doc) {
    Quizset.find({
        '_id': { $in: doc.quizset}
    }, function(err, docs){
        console.log(docs);
        res.send({quizset: docs})
    });
    }
    
})
});
  
module.exports = router;