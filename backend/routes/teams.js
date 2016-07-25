var express = require('express');
var router = express.Router();
var Teams = require('../lib/teams')

/* GET home page. */
router.post('/', function(req, res, next) {
  Teams.create(req.body).then(function(data) {
    res.sendStatus(200)
  })
});





module.exports = router;
