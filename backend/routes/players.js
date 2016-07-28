var express = require('express');
var router = express.Router();
var Players =  require('../lib/players')

/* GET home page. */
router.post('/', function(req, res, next) {
  Players.create(req.body).then(function(data) {
    res.sendStatus(200)
  })
});

router.get('/', function(req, res, next) {
  Players.all().then(function(players) {
    res.json(players.rows)
  })
});

router.get('/:id', function(req, res, next) {
  Players.playerRow(req.params.id).then(function(player) {
    res.json(player.rows[0])
  })
});

router.get('/:id/getStats', function(req, res, next) {
  Players.showOne(req.params.id).then(function(players) {
    res.json(players.rows)
  })
});

router.get('/:id/vsTeams', function(req, res, next) {
  Players.vsTeams(req.params.id).then(function(teams) {
    res.json(teams.rows)
  })
});







module.exports = router;
