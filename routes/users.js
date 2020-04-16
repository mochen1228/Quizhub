var express = require('express');
var router = express.Router();

var User = require('../models/models.js').User;
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post("/create-user", function(req, res) {
  const filter = {username:req.body.user.username};

  User.findOne(filter, function(err, user) {
      console.log("FOUND DOC:", user);

      if(err) {
          res.sendStatus(500);
      } else {
          // if user exists, create user unsuccessfully
          if (user != null) {
            res.send({username:null})
          }else {
            var user = new User(req.body.user);
            user.save().then(function (obj) {
              console.log("New user", obj._id);
              res.send({username: obj.username})}
            )
          }
      }
  })
  
});

router.post("/user-login", function(req, res) {
  console.log("user-login " + req.body.username)
  console.log("user-login " + req.body.password)
  const filter = {username:req.body.username, password:req.body.password};

  User.findOne(filter, function(err, user) {
      console.log("FOUND DOC:", user);

      if(err) {
          res.sendStatus(500);
      } else {
          // if user exists, create user unsuccessfully
          if (user == null) {
            res.send({username:null})
          }else {
            res.send({username: req.body.username})
          }
      }
  })
  
});


module.exports = router;
