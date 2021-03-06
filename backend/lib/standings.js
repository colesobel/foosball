var knex = require('../db/knex')

var queries = {
  leagueStandings: function() {
    return knex.raw(`select row_number() over (order by wins desc, losses, goals_for desc) as rank, wins_losses.team_id, wins_losses.team_name, wins_losses.wins, wins_losses.losses, goals_for.goals_for, goals_against.goals_against,
      (wins/(wins + case losses when 0 then 0.001 else losses end))::float as win_percentage,
      (goals_for/(goals_for + case goals_against when 0 then 0.001 else goals_against end))::float as goals_for_percentage
      from
      (
      select t.team_id, t.team_name, sum(wl.wins) as wins, sum(wl.losses) as losses
      from teams t
      join wins_losses wl on t.team_id = wl.team_id
      group by t.team_id, t.team_name
      order by wins desc
      ) wins_losses

      join

      (
      select team_id, team_name, sum(goals_for) as goals_for
      from
      (
      select t.team_id, t.team_name, sum(g.winning_goals) as goals_for
      from teams t
      join games g on t.team_id = g.winner_id
      group by t.team_id, t.team_name
      union
      select team_id, t.team_name, sum(g.losing_goals)
      from teams t
      join games g on t.team_id = g.loser_id
      group by t.team_id, t.team_name
      ) goals_for
      group by team_id, team_name
      ) goals_for on wins_losses.team_id = goals_for.team_id

      join

      (
      select team_id, team_name, sum(goals_against) as goals_against
      from
      (
      select t.team_id, t.team_name, sum(g.winning_goals) as goals_against
      from teams t
      join games g on t.team_id = g.loser_id
      group by t.team_id, t.team_name
      union
      select team_id, t.team_name, sum(g.losing_goals)
      from teams t
      join games g on t.team_id = g.winner_id
      group by t.team_id, t.team_name
      ) goals_against
      group by team_id, team_name
      ) goals_against on wins_losses.team_id = goals_against.team_id`)
  },
  playerStandings: function() {
    return knex.raw(`select row_number() over (order by wins desc, losses, goals_for desc) as rank, wins_losses.player_id, wins_losses.name, wins_losses.wins, wins_losses.losses, goals.goals_for, goals.goals_against,
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
      ) goals on wins_losses.player_id = goals.player_id`)
  }
}

module.exports = queries
