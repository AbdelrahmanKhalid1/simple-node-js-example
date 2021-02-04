const express = require('express');
const bodyParser = require('body-parser');

const User = require('./models/user');
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({username: req.body.username})
  .then((user) => {
    if(user != null){
      var err = new Error('User ' + req.body.username + ' already exist');
      err.status = 403;
      next(err);
    }
    else{
      return User.create({
        username: req.body.username,
        password: req.body.password
      })
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Regitration Successful', user: user});
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/login', (req, res, next) => {
  if(!req.session.user){ //Not included that means the user is not authenticated (logged in)
    var authHeader = req.headers.authorization;
 
    if(!authHeader){
      var err = new Error('You are not autheticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401; //unauthorized
      return next(err);
    }

    //splitting the header will return an array the first elemnet is authentication type (basic)
    //and the second is base64 encrypted existed
    //then we split the buffered to give us the username and password 'username:password' 
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    User.findOne({username: username})
    .then((user) => {
      if(user === null){
        var err = new Error('User ' + username + ' does not exist');
        err.status = 403;
        return next(err);
      }
      else if(user.password !== password){
        var err = new Error('Your password is incorrect!');
        err.status = 403;
        return next(err);
      }
      else {
        req.session.user = 'authenticazted';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated');
        //res.cookie('user', 'admin', {signed: true}); //takes string value name, user field, cookie options ==> set cookie name with options
        next(); //that mean move to next middleware
      }
    })
    .catch((err) => next(err));
  }
  else{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated');
  }
});

router.get('/logout', (req, res) => {
  if(req.session){
    req.session.destroy(); //destroying session info from server side
    res.clearCookie('session-id'); //delete cookie from client side with name (string value) the name is given in app.js
    res.redirect('/');
  }
  else{
    var err = new Error('You are not logged in!');
    err.stack = 403;
    next(err);
  }
});

module.exports = router;
