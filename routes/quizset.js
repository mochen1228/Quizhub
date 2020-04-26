var express = require('express');
var router = express.Router();
var path = require("path");
var MongoClient = require('mongodb').MongoClient;
var mongoose = require("mongoose");
var dbUrl = 'mongodb+srv://mochen1228:Mochen123!@cluster0-ouxvq.mongodb.net/test?retryWrites=true&w=majority';
var uuidv4 = require('uuid/v4')
var app = express();

var Quiz = require('../models/models.js').Quiz;
var Game = require('../models/models.js').Game;
var Quizset = require('../models/models.js').Quizset;
var QuizsetTag = require('../models/models.js').QuizsetTag;
var Picture = require('../models/models.js').Picture;
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
const DIR = './public/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});
// Get quizset from database
// Required params: 
// quizsetID:
//      type: ObjectID
router.post("/get-quiz-set", function(req, res) {
    console.log("get-quiz-set " + req.body.quizsetID)

    const filter = {_id:req.body.quizsetID};

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
//      type: ObjectID
router.post("/delete-question", function(req, res) {
    // console.log("delete-quiz " + req.body.gamePIN)
    console.log("delete-question " + req.body.id)
    
    const filter = {_id: req.body.quizsetID};

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

// Adda a new question to a quizset
router.post('/add-question', (req, res) => {
    console.log("Adding new question")
    var question = new Quiz({});
    question.save()
    var filter = {_id: req.body.quizsetID}
    Quizset.findOne(filter, function(err, set) {
        console.log("QUIZSET FOUND:", set);
        if (set){
            // Avoid duplicates
            if (!set.quizset.includes(question._id)) {
                set.quizset.push(question._id);
                set.save();
            }
            // Send updated question list back to the page for refresh
            Quiz.find({
                '_id': { $in: set.quizset}
            }, function(err, docs){                
                res.send({quizset: docs, id:question._id});     
            });
        }
        
    })
})

// Update a question to a quizset
// 
router.post('/update-question', (req, res) => {
    console.log("update-question " + req.body.question.id)
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
            doc.picture = question.picture;
            doc.time = question.time;
            doc.save();
        }

        // Push new Question to Quizset
        var filter = {_id: req.body.quizsetID}
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

// Update the name and tags of the quizset
// Required params:
// tag:
//      type: [String]
//      Array of tags
// quizsetID:
//      type: ObjectID
router.post('/update-quizset', (req, res) => {
    console.log("tag " + req.body.tag)

    const filter = {_id: req.body.quizsetID};


    Quizset.findOne(filter, function(err, set) {
        console.log("FOUND DOC:", set);
        if(err) {
            res.sendStatus(500);
        } else {
            // Update name
            set.name = req.body.name
            // Update tags
            // Remove existed tags
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
        }
    })
})


// Creates a new quizset
// This action should be done after user has selected "host game"
//      on game join page
// No params needed
router.post('/create-quizset', (req, res) => {
    var set = new Quizset({name:"New Quizset"});
    set.save().then(function (obj) {
        console.log("New set ID:", obj._id);
        res.send({quizsetID: obj._id});
    });
})


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

// Post the quiz image
router.post('/upload_image', upload.single('image'), function (req, res) {
    const url = req.protocol + '://' + req.get('host')
    var filename = url +"/" + req.file.filename;
    res.status(201).json({
        message: "User registered successfully!",
        image: {
            filename: filename
        }
    })
 })
  
 router.post("/validate-quizset", function(req, res) {
    console.log("validate-quizset " + req.body.quizsetID)

    const filter = {_id:req.body.quizsetID};

    // Preload the quizzes to the result
    // Array of Quiz objects in the quizset
    var quizzes = new Array();

    Quizset.findOne(filter, function(err, quizset) {
        console.log("FOUND DOC:", quizset);
        if(err) {
            res.sendStatus(500);
            res.send({result: false, message: "Cannot connect database"})
        } else {
            // Find all the Quiz objects in the quizset using objectIDs
            // in quizset.quizset
            Quiz.find({
                '_id': { $in: quizset.quizset}
            }, function(err, questions){
                if (questions == null || questions.length == 0) {
                    res.send({result: false, message: "Please add at least one question in quizset!"})
                    return
                } else {
                    var error = false;
                    questions.forEach((q)=>{
                        if (q.content == null || q.content == "") {
                            error = true;
                        }
                    })
                    
                    if (error) {
                        res.send({result: false, message: "Please fill in all questions you added!"})
                    }else {
                        res.send({result: true})
                    }
                }
                
            });
            

        }
    })
});

module.exports = router;