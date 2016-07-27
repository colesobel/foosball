var knex = require('../db/knex')

var queries = {
  create: function(obj) {
    return knex.raw(`insert into teams values (default, '${obj.teamName.trim()}', (select player_id from players where name = '${obj.playerOne.trim()}'), (select player_id from players where name = '${obj.playerTwo.trim()}'))`)
  },
  showOne: function(id) {
    return knex.raw(`select all_teams.team_id, all_teams.team_name, coalesce(wins_against.wins_against,0) as wins_against, coalesce(losses_against.losses_against, 0) as losses_against,
      coalesce(goals_for.goals_for, 0) as goals_for, coalesce(goals_against.goals_against, 0) as goals_against,
      (coalesce(wins_against, 0) / (coalesce(wins_against, 0) + coalesce(losses_against, 0.00${id})))::float as win_percentage,
      (goals_for / (goals_for + case goals_against when 0 then 0.00${id} else goals_against end))::float as goals_for_percentage

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
