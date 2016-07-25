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





module.exports = router;
