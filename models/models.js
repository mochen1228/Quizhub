var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose); // npm install --save mongoose-sequence

const SessionSchema = mongoose.Schema({
    gamePIN: {
      type: String,
      required: true
    },
    players: {
      type: [String],
      required: true
    }
})

// Picture model
var PictureSchema = new mongoose.Schema({
  img: { data: Buffer, contentType: String }
});

// User model
var UserSchema = new mongoose.Schema({
   username: {type: String, lowercase: true, index: true},
   password: {
    type: String,
    required: [true, "can't be blank"]
   },
  //  image:{type: [PictureSchema]},
  //  bio:[String],
   email: {type: String, lowercase: true, index: true},
   update: { type: Date, default: Date.now }
  });

// Quiz model
var QuizSchema = new mongoose.Schema({
    content: String,
    // picture: {type: [PictureSchema]},
    // 4 options for player
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    // the right answer
    answer: String,
    time: {type: Number, default: 0},
    update: { type: Date, default: Date.now }
});

// Player model supports to store guest and user
var PlayerSchema = new mongoose.Schema({
  userid: String,
  nickname: String,
  update: { type: Date, default: Date.now }
});

// Quizset model
var QuizsetSchema = new mongoose.Schema({
  quizsetID: Number,
  name: String,
  tag: [String],
  quizset: [mongoose.Types.ObjectId],
  update: { type: Date, default: Date.now },
})

var TagSchema = new mongoose.Schema({
  tag: String,
  quizset: [mongoose.Types.ObjectId],
  update: { type: Date, default: Date.now }
})

// Game model 
var GameSchema = new mongoose.Schema({
  // unique PIN for each game
  gamePIN: Number,
  // quizset id
  quizset: {type: mongoose.Types.ObjectId},
  // an array of player
  players: [PlayerSchema],
  update: { type: Date, default: Date.now }
});
GameSchema.plugin(AutoIncrement, {id: 'gamePIN_seq', inc_field: 'gamePIN'});

// record model for storing quiz history
var RecordSchema = new mongoose.Schema({
  gamePIN: [String],
  player: {type: PlayerSchema},
  // the quiz player answered
  quiz: {type: QuizSchema},
  // player's option
  option: [String],
  // the right answer
  answer: [String],
  update: {type: Date, default: Date.now}
});


var Session = mongoose.model("Sessions", SessionSchema)
var Quiz = mongoose.model("Quiz", QuizSchema)
mongoose.model('Picture', PictureSchema);
mongoose.model('Record', RecordSchema);
var Player = mongoose.model('Player', PlayerSchema);
var QuizsetTag = mongoose.model('QuizsetTag', TagSchema);
var Game = mongoose.model('Game', GameSchema);
var Quizset = mongoose.model('Quizset', QuizsetSchema);
var User = mongoose.model('User', UserSchema);
module.exports = {
  Session, Quiz, Game, Quizset, QuizsetTag, Player, User
} 