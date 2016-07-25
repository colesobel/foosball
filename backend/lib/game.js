var knex = require('../db/knex')

var queries = {
  allTeams: function() {
    return knex.raw(`select team_name from teams`)
  },
  createGame: function(obj) {
    return knex.raw(`select team_id from teams where team_name = '${obj.winning_team}'`).then(function(winner_id) {
      return knex.raw(`select team_id from teams where team_name = '${obj.losing_team}'`).then(function(loser_id) {
        return knex.raw(`insert into games values (default, ${winner_id.rows[0].team_id}, ${loser_id.rows[0].team_id}, ${obj.winning_goals}, ${obj.losing_goals})`).then(function() {
          return knex.raw(`insert into wins_losses values (default, ${winner_id.rows[0].team_id}, 1, 0)`).then(function() {
            return knex.raw(`insert into wins_losses values (default, ${loser_id.rows[0].team_id}, 0, 1)`)
          })
        })
      })
    })
  }
}



module.exports = queries
