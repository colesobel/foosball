var knex = require('../db/knex')

var queries = {
  create: function(obj) {
    return knex.raw(`insert into teams values (default, '${obj.teamName.trim()}', (select player_id from players where name = '${obj.playerOne.trim()}'), (select player_id from players where name = '${obj.playerTwo.trim()}'))`)
  },
  showOne: function(id) {
    return knex.raw(`select all_teams.team_id, all_teams.team_name, coalesce(wins_against.wins_against,0) as wins_against, coalesce(losses_against.losses_against, 0) as losses_against,
      coalesce(goals_for.goals_for, 0) as goals_for, coalesce(goals_against.goals_against, 0) as goals_against,
      (coalesce(wins_against, 0) / (coalesce(wins_against, 0) + coalesce(losses_against, 0.001)))::float as win_percentage,
      (goals_for / (goals_for + case goals_against when 0 then 0.001 else goals_against end))::float as goals_for_percentage

      from

      (
      select t.team_id, t.team_name
      from teams t
      where t.team_id <> ${id}
      ) as all_teams

      left join

      (
      select t.team_id, count(g.loser_id) as wins_against
      from teams t
      join games g on t.team_id = g.loser_id
      where t.team_id <> ${id}
      and winner_id = ${id}
      group by t.team_id, t.team_name
      ) as wins_against on all_teams.team_id = wins_against.team_id

      left join

      (
      select t.team_id, count(g.winner_id) as losses_against
      from teams t
      join games g on t.team_id = g.winner_id
      where t.team_id <> ${id}
      and loser_id = ${id}
      group by t.team_id, t.team_name
      ) as losses_against on all_teams.team_id = losses_against.team_id

      left join

      (
      select team_id, sum(winning_goals_for) as goals_for
      from
      (
      select teams.team_id, coalesce(winning_goals_for, 0) as winning_goals_for
      from
      (select team_id from teams where team_id <> ${id}) teams
      left join
      (
      select t.team_id, sum(g.winning_goals) as winning_goals_for
      from teams t
      left join games g on t.team_id = g.loser_id
      where t.team_id <> ${id}
      and g.winner_id = ${id}
      group by t.team_id
      ) winning_goals_for on teams.team_id = winning_goals_for.team_id
      union
      select teams.team_id, coalesce(losing_goals_for, 0) as losing_goals_for
      from
      (select team_id from teams where team_id <> ${id}) teams
      left join
      (
      select t.team_id, sum(g.losing_goals) as losing_goals_for
      from teams t
      left join games g on t.team_id = g.winner_id
      where t.team_id <> ${id}
      and g.loser_id = ${id}
      group by t.team_id
      ) losing_goals_for on teams.team_id = losing_goals_for.team_id
      ) goals_for
      group by team_id
      ) goals_for on all_teams.team_id = goals_for.team_id

      left join

      (
      select team_id, sum(losing_goals_against) as goals_against
      from
      (
      select teams.team_id, coalesce(losing_goals_against, 0) as losing_goals_against
      from
      (select team_id from teams where team_id <> ${id}) teams
      left join
      (
      select t.team_id, sum(g.winning_goals) as losing_goals_against
      from teams t
      left join games g on t.team_id = g.winner_id
      where t.team_id <> ${id}
      and g.loser_id = ${id}
      group by t.team_id
      ) losing_goals_against on teams.team_id = losing_goals_against.team_id
      union
      select teams.team_id, coalesce(winning_goals_against, 0) as winning_goals_against
      from
      (select team_id from teams where team_id <> ${id}) teams
      left join
      (
      select t.team_id, sum(g.losing_goals) as winning_goals_against
      from teams t
      left join games g on t.team_id = g.loser_id
      where t.team_id <> ${id}
      and g.winner_id = ${id}
      group by t.team_id
      ) winning_goals_against on teams.team_id = winning_goals_against.team_id
      ) goals_against
      group by team_id
      ) goals_against on all_teams.team_id = goals_against.team_id
      order by wins_against desc, losses_against`)
  },
  getTeamName: function(id) {
    return knex.raw(`select team_name from teams where team_id = ${id}`)
  },
  vsPlayers: function(id) {
    return knex.raw(`select all_players.player_id, all_players.name, coalesce(wins, 0) as wins, coalesce(losses, 0) as losses, coalesce(goals_for, 0) as goals_for, coalesce(goals_against, 0) as goals_against,
      (coalesce(wins, 0) / (coalesce(wins, 0) + coalesce(case losses when 0 then 0.001 else losses end, 0.001)))::float as win_percentage,
      (coalesce(goals_for, 0) / (coalesce(goals_for, 0) + coalesce(case goals_against when 0 then 0.001 else goals_against end, 0.001)))::float as goals_for_percentage

      from

      (
      select distinct p.player_id, p.name
      from
      players p
      left join teams t on p.player_id = t.player_one_id or p.player_id = t.player_two_id
      where p.player_id <> (select player_one_id from teams where team_id = ${id}) and p.player_id <> (select player_two_id from teams where team_id = ${id})
      ) all_players

      left join

      (
      select p.player_id, p.name, count(g.winner_id) as wins
      from players p
      left join teams t on p.player_id = t.player_one_id or p.player_id = t.player_two_id
      left join games g on t.team_id = g.loser_id
      where g.winner_id = ${id}
      group by p.player_id, p.name
      ) wins on all_players.player_id = wins.player_id

      left join

      (
      select p.player_id, p.name, count(g.loser_id) as losses
      from players p
      left join teams t on p.player_id = t.player_one_id or p.player_id = t.player_two_id
      left join games g on t.team_id = g.winner_id
      where g.loser_id = ${id}
      group by p.player_id, p.name
      ) losses on all_players.player_id = losses.player_id

      left join

      (
      select goals_for.player_id, goals_for.name, sum(winning_goals_for) as goals_for
      from
      (
      select p.player_id, p.name, sum(g.winning_goals) as winning_goals_for
      from players p
      left join teams t on p.player_id = t.player_one_id or p.player_id = t.player_two_id
      left join games g on t.team_id = g.loser_id
      where g.winner_id = ${id}
      group by p.player_id, p.name
      union
      select p.player_id, p.name, sum(g.losing_goals) as losing_goals_for
      from players p
      left join teams t on p.player_id = t.player_one_id or p.player_id = t.player_two_id
      left join games g on t.team_id = g.winner_id
      where g.loser_id = ${id}
      group by p.player_id, p.name
      )goals_for
      group by goals_for.player_id, goals_for.name
      ) goals_for on all_players.player_id = goals_for.player_id

      left join

      (
      select goals_against.player_id, goals_against.name, sum(losing_goals_against) as goals_against
      from
      (
      select p.player_id, p.name, sum(g.winning_goals) as losing_goals_against
      from players p
      left join teams t on p.player_id = t.player_one_id or p.player_id = t.player_two_id
      left join games g on t.team_id = g.winner_id
      where g.loser_id = ${id}
      group by p.player_id, p.name
      union
      select p.player_id, p.name, sum(g.losing_goals) as wining_goals_against
      from players p
      left join teams t on p.player_id = t.player_one_id or p.player_id = t.player_two_id
      left join games g on t.team_id = g.loser_id
      where g.winner_id = ${id}
      group by p.player_id, p.name
      )goals_against
      group by goals_against.player_id, goals_against.name
      ) goals_against on all_players.player_id = goals_against.player_id

      order by wins desc, losses`)
  },
  goalsByGame: function(id) {
    return knex.raw(`select game_id, row_number() over (order by game_id) as game_number, goals_for, goals_against from
      (
      select g.game_id, g.winning_goals as goals_for, g.losing_goals as goals_against
      from games g
      join teams t on g.winner_id = t.team_id
      where g.winner_id = ${id}
      union
      select g.game_id, g.losing_goals, g.winning_goals
      from games g
      join teams t on g.loser_id = t.team_id
      where g.loser_id = ${id}
      ) games`)
  }
}

module.exports = queries
