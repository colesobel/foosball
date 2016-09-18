var express = require('express');
var router = express.Router();
var Teams = require('../lib/teams')

/* GET home page. */
router.post('/', function(req, res, next) {
  Teams.create(req.body).then(function(data) {
    res.sendStatus(200)
  })
});

router.get('/:id', function(req, res, next) {
  Teams.showOne(req.params.id).then(function(data) {
    res.json(data.rows)
  })
});

router.get('/getName/:id', function(req, res, next) {
  Teams.getTeamName(req.params.id).then(function(data) {
    res.json(data.rows[0].team_name)
  })
});

router.get('/:id/vsPlayers', function(req, res, next) {
  Teams.vsPlayers(req.params.id).then(function(data) {
    res.json(data.rows)
  })
});

router.get('/:id/goalsByGame', function(req, res, next) {
  Teams.goalsByGame(req.params.id).then(function (games) {
    res.json(games.rows)
  })
});












module.exports = router;
