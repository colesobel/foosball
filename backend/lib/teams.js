var knex = require('../db/knex')

var queries = {
  create: function(obj) {
    return knex.raw(`insert into teams values (default, '${obj.teamName.trim()}', (select player_id from players where name = '${obj.playerOne.trim()}'), (select player_id from players where name = '${obj.playerTwo.trim()}'))`)
  }
}

module.exports = queries






// **********Query to get one teams goals**************
// select sum(goals) as goals_for_team from (select sum(winning_goals) as goals
// from games g
// join teams t on g.winner_id = t.team_id
// where t.team_name = 'DevRick'
// and g.winner_id in (select team_id from teams where team_name = 'DevRick')
// union
// select sum(losing_goals)
// from games g
// join teams t on g.loser_id = t.team_id
// where t.team_name = 'DevRick'
// and g.loser_id in (select team_id from teams where team_name = 'DevRick')) as goals



// *************Query to get goals against one team**************
// select sum(goals) as goals_against_team from (select sum(losing_goals) as goals
// from games g
// join teams t on g.winner_id = t.team_id
// where t.team_name = 'DevRick'
// and g.winner_id in (select team_id from teams where team_name = 'DevRick')
// union
// select sum(winning_goals)
// from games g
// join teams t on g.loser_id = t.team_id
// where t.team_name = 'DevRick'
// and g.loser_id in (select team_id from teams where team_name = 'DevRick')) as goals
