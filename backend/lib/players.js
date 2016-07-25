var knex = require('../db/knex')
var players = {
  create: function(obj) {
    return knex.raw(`insert into players values(default, '${obj.name}')`)
  },
  all: function() {
    return knex.raw(`select * from players`)
  }
}


module.exports = players

// **************Query to get One Players Goals*************
// select sum(goals) as goals_for_player from (select sum(winning_goals) as goals
// from games g
// join teams t on g.winner_id = t.team_id
// join players p on t.player_one_id = p.player_id or t.player_two_id = p.player_id
// where p.name = 'Cole'
// and g.winner_id in (select team_id from teams where player_one_id = (select player_id from players where name = 'Cole')
// or player_two_id = (select player_id from players where name = 'Cole'))
// union
// select sum(losing_goals)
// from games g
// join teams t on g.loser_id = t.team_id
// join players p on t.player_one_id = p.player_id or t.player_two_id = p.player_id
// where p.name = 'Cole'
// and g.loser_id in (select team_id from teams where player_one_id = (select player_id from players where name = 'Cole')
// or player_two_id = (select player_id from players where name = 'Cole'))) as goals


// ***********Query to get goals against one player***********
// select sum(goals) as goals_against_player from (select sum(losing_goals) as goals
// from games g
// join teams t on g.winner_id = t.team_id
// join players p on t.player_one_id = p.player_id or t.player_two_id = p.player_id
// where p.name = 'Devin'
// and g.winner_id in (select team_id from teams where player_one_id = (select player_id from players where name = 'Devin')
// or player_two_id = (select player_id from players where name = 'Devin'))
// union
// select sum(winning_goals)
// from games g
// join teams t on g.loser_id = t.team_id
// join players p on t.player_one_id = p.player_id or t.player_two_id = p.player_id
// where p.name = 'Devin'
// and g.loser_id in (select team_id from teams where player_one_id = (select player_id from players where name = 'Devin')
// or player_two_id = (select player_id from players where name = 'Devin'))) as goals
