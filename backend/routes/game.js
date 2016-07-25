var express = require('express');
var router = express.Router();
var Game = require('../lib/game')

/* GET home page. */
router.get('/getTeams', function(req, res, next) {
  Game.allTeams().then(function(teams) {
    res.json(teams)
  })
});

router.post('/new', function(req, res, next) {
  Game.createGame(req.body).then(function() {
    res.sendStatus(200)
  })
});






module.exports = router;
