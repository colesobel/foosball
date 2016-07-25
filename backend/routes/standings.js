var express = require('express');
var router = express.Router();
var Standings = require('../lib/standings')

/* GET home page. */
router.get('/team', function(req, res, next) {
  Standings.leagueStandings().then(function(standings) {
    res.json(standings.rows)
  })
});

router.get('/player', function(req, res, next) {
  Standings.playerStandings().then(function(standings) {
    res.send(standings.rows)
  })
});





module.exports = router;
