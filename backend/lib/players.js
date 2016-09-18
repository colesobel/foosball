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
  },
  showOne: function(id) {
    return knex.raw(`select goals_for.player_id, goals_for.name, wins_against, coalesce(losses_against, 0) as losses_against, goals_for, goals_against,
      (wins_against / (wins_against + coalesce(case losses_against when 0 then 0.001 else losses_against end, 0.001)))::float as win_percentage,
      (goals_for / (goals_for + case goals_against when 0 then 0.001 else goals_against end))::float as goals_for_percentage

      from

      (
      select players.player_id, players.name, coalesce(wins.wins_against, 0) as wins_against from players
      left join
      (
      select p.player_id, p.name, count(g.loser_id) as wins_against
      from players p
      left join teams t on p.player_id = t.player_one_id or p.player_id = t.player_two_id
      left join games g on t.team_id = g.loser_id
      where p.player_id <> ${id}
      and g.winner_id in (select team_id from teams where player_one_id = ${id} or player_two_id = ${id})
      group by p.player_id, p.name
      ) wins on players.player_id = wins.player_id
      where players.player_id <> ${id}
      ) wins_against

      left join

      (
      select p.player_id, p.name, count(g.winner_id) as losses_against
      from players p
      left join teams t on p.player_id = t.player_one_id or p.player_id = t.player_two_id
      left join games g on t.team_id = g.winner_id
      where p.player_id <> ${id}
      and g.loser_id in (select team_id from teams where player_one_id = ${id} or player_two_id = ${id})
      group by p.player_id, p.name
      ) losses_against on wins_against.player_id = losses_against.player_id

      left join

      (
      select player_id, name, sum(goals_for) as goals_for from (
      select p.player_id, p.name, coalesce(winning_goals_for.goals_for, 0) as goals_for
      from players p
      left join
      (
      select p.player_id, p.name, sum(g.winning_goals) as goals_for
      from players p
      left join teams t on p.player_id = t.player_one_id or p.player_id = t.player_two_id
      left join games g on t.team_id = g.loser_id
      where player_id <> ${id}
      and g.winner_id in (select team_id from teams where player_one_id = ${id} or player_two_id = ${id})
      group by p.player_id, p.name
      ) winning_goals_for on p.player_id = winning_goals_for.player_id
      where p.player_id <> ${id}
      union
      select p.player_id, p.name, coalesce(losing_goals_for.losing_goals_for, 0) as losing_goals_for
      from players p
      left join
      (
      select p.player_id, p.name, sum(g.losing_goals) as losing_goals_for
      from players p
      left join teams t on p.player_id = t.player_one_id or p.player_id = t.player_two_id
      left join games g on t.team_id = g.winner_id
      where player_id <> ${id}
      and g.loser_id in (select team_id from teams where player_one_id = ${id} or player_two_id = ${id})
      group by p.player_id, p.name
      ) losing_goals_for on p.player_id = losing_goals_for.player_id
      where p.player_id <> ${id}) goals_for
      group by player_id, name
      ) goals_for on wins_against.player_id = goals_for.player_id

      left join

      (
      select player_id, sum(goals_against) as goals_against from (
      select p.player_id, p.name, coalesce(losing_goals_against.losing_goals_against, 0) as goals_against
      from players p
      left join
      (
      select p.player_id, p.name, sum(g.winning_goals) as losing_goals_against
      from players p
      left join teams t on p.player_id = t.player_one_id or p.player_id = t.player_two_id
      left join games g on t.team_id = g.winner_id
      where player_id <> ${id}
      and g.loser_id in (select team_id from teams where player_one_id = ${id} or player_two_id = ${id})
      group by p.player_id, p.name
      ) losing_goals_against on p.player_id = losing_goals_against.player_id
      where p.player_id <> ${id}
      union
      select p.player_id, p.name, coalesce(winning_goals_against.winning_goals_against, 0) as winning_goals_against
      from players p
      left join
      (
      select p.player_id, p.name, sum(g.losing_goals) as winning_goals_against
      from players p
      left join teams t on p.player_id = t.player_one_id or p.player_id = t.player_two_id
      left join games g on t.team_id = g.loser_id
      where player_id <> ${id}
      and g.winner_id in (select team_id from teams where player_one_id = ${id} or player_two_id = ${id})
      group by p.player_id, p.name
      ) winning_goals_against on p.player_id = winning_goals_against.player_id
      where p.player_id <> ${id}) goals_against
      group by player_id
      ) goals_against on goals_for.player_id = goals_against.player_id

      order by wins_against desc, losses_against`)
  },
  vsTeams: function(id) {
    return knex.raw(`select all_teams.team_id, all_teams.team_name, coalesce(wins, 0) as wins, coalesce(losses, 0) as losses, coalesce(goals_for, 0) as goals_for, coalesce(goals_against, 0) as goals_against,
      coalesce(wins, 0) / (coalesce(wins,0) + coalesce(case losses when 0 then 0.001 else losses end, 0.001))::float as win_percentage,
      coalesce(goals_for, 0) / (coalesce(goals_for, 0) + coalesce(case goals_against when 0 then 0.001 else goals_against end, 0.001))::float as goals_for_percentage

      from

      (
      select team_id, team_name
      from teams
      where player_one_id <> ${id} and player_two_id <> ${id}
      ) all_teams

      left join

      (
      select t.team_id, t.team_name, count(g.winner_id) as wins
      from teams t
      left join games g on t.team_id = g.loser_id
      where player_one_id <> ${id} and player_two_id <> ${id}
      and g.winner_id in (select team_id from teams where player_one_id = ${id} or player_two_id = ${id})
      group by t.team_id, t.team_name
      ) wins on all_teams.team_id = wins.team_id

      left join

      (
      select t.team_id, t.team_name, count(g.loser_id) as losses
      from teams t
      left join games g on t.team_id = g.winner_id
      where player_one_id <> ${id} and player_two_id <> ${id}
      and g.loser_id in (select team_id from teams where player_one_id = ${id} or player_two_id = ${id})
      group by t.team_id, t.team_name
      ) losses on all_teams.team_id = losses.team_id

      left join

      (
      select team_id, team_name, sum(winning_goals_for) as goals_for from (
      select t.team_id, t.team_name, sum(g.winning_goals) as winning_goals_for
      from teams t
      left join games g on t.team_id = g.loser_id
      where player_one_id <> ${id} and player_two_id <> ${id}
      and g.winner_id in (select team_id from teams where player_one_id = ${id} or player_two_id = ${id})
      group by t.team_id, t.team_name
      union
      select t.team_id, t.team_name, sum(g.losing_goals) as losing_goals_for
      from teams t
      left join games g on t.team_id = g.winner_id
      where player_one_id <> ${id} and player_two_id <> ${id}
      and g.loser_id in (select team_id from teams where player_one_id = ${id} or player_two_id = ${id})
      group by t.team_id, t.team_name
      ) goals
      group by team_id, team_name
      ) goals_for on all_teams.team_id = goals_for.team_id

      left join

      (
      select team_id, team_name, sum(losing_goals_against) as goals_against from (
      select t.team_id, t.team_name, sum(g.winning_goals) as losing_goals_against
      from teams t
      left join games g on t.team_id = g.winner_id
      where player_one_id <> ${id} and player_two_id <> ${id}
      and g.loser_id in (select team_id from teams where player_one_id = ${id} or player_two_id = ${id})
      group by t.team_id, t.team_name
      union
      select t.team_id, t.team_name, sum(g.losing_goals) as winning_goals_against
      from teams t
      left join games g on t.team_id = g.loser_id
      where player_one_id <> ${id} and player_two_id <> ${id}
      and g.winner_id in (select team_id from teams where player_one_id = ${id} or player_two_id = ${id})
      group by t.team_id, t.team_name
      ) goals
      group by team_id, team_name
      ) goals_against on all_teams.team_id = goals_against.team_id

      order by wins desc, losses`)
  },
  goalsByGame: function (id) {
    return knex.raw(`select game_id, row_number() over (order by game_id) as game_number, goals_for, goals_against from
      (
      select g.game_id, g.winning_goals as goals_for, g.losing_goals as goals_against
      from games g
      join teams t on g.winner_id = t.team_id
      join players p on t.player_one_id = p.player_id or t.player_two_id = p.player_id
      where g.winner_id in (select team_id from teams t join players p on t.player_one_id = p.player_id or t.player_two_id = p.player_id where p.player_id = ${id})
      union
      select g.game_id, g.losing_goals, g.winning_goals
      from games g
      join teams t on g.loser_id = t.team_id
      where g.loser_id in (select team_id from teams t join players p on t.player_one_id = p.player_id or t.player_two_id = p.player_id where p.player_id = ${id})
      ) games`)
  }
}


module.exports = players
