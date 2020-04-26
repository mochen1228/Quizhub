var createError = require('http-errors');
var express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

// MongoDB related setups
var mongoose = require("mongoose");
var bodyParser = require('body-parser')
var dbUrl = 'mongodb+srv://mochen1228:Mochen123!@cluster0-ouxvq.mongodb.net/test?retryWrites=true&w=majority';

const axios = require("axios");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");
var quizsetRouter = require("./routes/quizset");
var sessionRouter = require("./routes/session");


// var Session = require('./models/models.js').Session;
var Game = require('./models/models.js').Game;
var Quizset = require('./models/models.js').Quizset;
var Quiz = require('./models/models.js').Quiz;
// var Player = require('./models/models.js').Player;

// our localhost port
// const port = 4001

const port = process.env.PORT || 4001;

var app = express();

// Static files directory
app.use(express.static(path.join(__dirname, 'client', 'build')));

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)


// const SessionSchema = mongoose.Schema({
//   gamePIN: {
//     type: String,
//     required: true
//   },
//   players: {
//     type: [String],
//     required: true
//   }
// })

// var Session = mongoose.model("Sessions", SessionSchema)

// Connects to MongoDB server
mongoose.connect(dbUrl , (err) => {
  console.log("mongodb connected",err);
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/testAPI', testAPIRouter);
app.use('/quizset', quizsetRouter);
app.use('/session', sessionRouter);

// Load react app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// hard code answerStatistic, should get from database
// var answerStatistic= [
//   { name: 'A', value: 1 },
//   { name: 'B', value: 3 },
//   { name: 'C', value: 2 },
//   { name: 'D', value: 4 },
// ];

var currentSessions = {}


// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  console.log('New client connected');
  
  // broadcast the latest player list if someone requested
  socket.on('get player list', (gamePin) => {
    const pinFilter = {gamePIN: gamePin};
    Game.findOne(pinFilter, function(err,doc) { 
      // console.log("FOUND DOC:", doc);
      if(err) {
        res.sendStatus(500);
      } else {
        if (doc) {
          io.sockets.emit('update player list' + gamePin, doc.players);
        }
      }
    });
  });

    // Enter game, send the quiz name
    socket.on('enter game', (gamePin) => {
      currentSessions[gamePin] = {}
      const pinFilter = {gamePIN: gamePin};
      Game.findOne(pinFilter, function(err, game) { 
        // console.log("FOUND DOC:", game)
        if(err) {
          res.sendStatus(500);
        } else {
          Quizset.findById(game.quizset, function(err, quizset) {
            console.log(quizset);
            io.sockets.emit('enter game' + gamePin, quizset.name);
          })
        }
      })
    });

  // Start game, send the entire quiz
  socket.on('start game', (gamePin) => {
    currentSessions[gamePin] = {}
    const pinFilter = {gamePIN: gamePin};
    Game.findOne(pinFilter, function(err, game) { 
      // console.log("FOUND DOC:", game)
      if(err) {
        res.sendStatus(500);
      } else {
        Quizset.findById(game.quizset, function(err, quizset) {
          console.log(quizset);
          Quiz.find({
            '_id': { $in: quizset.quizset}
          }, function(err, quizzes){
              console.log(quizzes);
              io.sockets.emit('start game' + gamePin, quizzes);
          });
        })
      }
    })
  });

  // show answer, send the answer statistic
  socket.on('show answer', (info) => {
    console.log('game ' + info.gamePIN + ', show answer for quiz ' + info.quizNo);
    io.sockets.emit('show answer' + info.gamePIN, info.answerStatistic);
    // TODO:
    // Upload previous stats to database
    currentSessions[info.gamePIN][info.quizNo] = info.answerStatistic
    console.log(currentSessions)
  });

  // next quiz, send the quiz number
  socket.on('next quiz', (info) => {
    console.log('game ' + info.gamePIN + ', turn to quiz ' + info.quizNo);
    io.sockets.emit('next quiz' + info.gamePIN, info.quizNo);
  });

  // show result
  socket.on('show result', (info) => {
    console.log('game ' + info.gamePIN);
    io.sockets.emit('show result' + info.gamePIN, currentSessions[info.gamePIN]);
  });

  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('user disconnected')

    
  });

  // Collect answers from players
  socket.on('submit answer', (info) => {
    console.log('A user from game', info.gamePIN, 'has submitted a answer', info.choice)
    io.sockets.emit('notify host', {
      gamePIN: info.gamePIN,
      choice: info.choice
    });
  })

  // Remove player from game session and notify host
  socket.on('player leave', (info) => {
    console.log(info.nickname, 'from game', info.gamePIN, 'has left')
    axios.post('https://guarded-gorge-11703.herokuapp.com/session/remove-player', {
      gamePIN: info.gamePIN,
      player: info.nickname
    }).then(res => {
      const pinFilter = {gamePIN: info.gamePIN};
      Game.findOne(pinFilter, function(err,doc) { 
        if(err) {
          res.sendStatus(500);
        } else {
          io.sockets.emit('update player list' + info.gamePIN, doc.players);
        }
      });
    })
  })

  // Notify players that a host has disconnected
  socket.on('host leave', (info) => {
    console.log("Host of", info.gamePIN, "has left. Disconnecting players...")
    axios.post('https://guarded-gorge-11703.herokuapp.com/session/remove-session', {
      gamePIN: info.gamePIN
    }).then(res => {
      console.log("emitting:", "host left" + info.gamePIN)
      io.sockets.emit("host left" + info.gamePIN)
    })
  })

});

server.listen(port, () => console.log(`Listening on port ${port}`))

module.exports = app;

