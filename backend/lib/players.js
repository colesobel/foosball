var knex = require('../db/knex')
var players = {
  create: function(obj) {
    return knex.raw(`insert into players values(default, '${obj.name}')`)
  },
  all: function() {
    return knex.raw(`select * from players`)
  },
  playerRow: function(id) {
    return knex.raw(`select wins_losses.player_id, wins_losses.name, wins_losses.wins, wins_losses.losses, goals.goals_for, goals.goals_against,
      (wins/ (wins + case losses when 0 then 0.001 else losses end))::float as win_percentage,
      (goals_for / (goals_for + case goals_against when 0 then 0.001 else goals_against end))::float as goals_for_percentage
       from
      (
      select p.name, p.player_id, sum(wl.wins) as wins, sum(wl.losses) as losses
      from players p
      join teams t on p.player_id = t.player_one_id or p.player_id = t.player_two_id
      join wins_losses wl on t.team_id = wl.team_id
      group by p.name, p.player_id
      ) wins_losses

      join

      (
      select distinct goals_for.name, goals_for.player_id, sum(goals_for) as goals_for, sum(goals_against) as goals_against
      from

      (
      select distinct name, player_id, sum(goals_for) as goals_for from (
      select p.name, p.player_id, sum(winning_goals) as goals_for
      from players p
      join teams t on p.player_id = player_one_id or p.player_id = player_two_id
      join games g on g.winner_id = t.team_id
      group by p.name, p.player_id
      union
      select p.name, p.player_id, sum(losing_goals) as goals_for
      from players p
      join teams t on p.player_id = player_one_id or p.player_id = player_two_id
      join games g on g.loser_id = t.team_id
      group by p.name, p.player_id) as goals
      group by name, player_id
      ) as goals_for

      join

      (
      select name, player_id, sum(goals_against) as goals_against from (
      select p.name, p.player_id, sum(losing_goals) as goals_against
      from players p
      join teams t on p.player_id = player_one_id or p.player_id = player_two_id
      join games g on g.winner_id = t.team_id
      group by p.name, p.player_id
      union
      select p.name, p.player_id, sum(winning_goals) as goals_for
      from players p
      join teams t on p.player_id = player_one_id or p.player_id = player_two_id
      join games g on g.loser_id = t.team_id
      group by p.name, p.player_id) as goals
      group by name, player_id
      ) as goals_against on goals_for.player_id = goals_against.player_id

      group by goals_for.name, goals_for.player_id
      order by goals_for desc, goals_against
      ) goals on wins_losses.player_id = goals.player_id
      where wins_losses.player_id = ${id}

      order by wins desc, losses, goals_for desc`)
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
