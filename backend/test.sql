select goals_for.name, goals_for.player_id, sum(goals_for) as goals_for, sum(goals_against) as goals_against
from
(select p.name, p.player_id, sum(winning_goals) as goals_for
from players p
join teams t on p.player_id = player_one_id or p.player_id = player_two_id
join games g on g.winner_id = t.team_id
group by p.name, p.player_id
union
select p.name, p.player_id, sum(losing_goals) as goals_for
from players p
join teams t on p.player_id = player_one_id or p.player_id = player_two_id
join games g on g.loser_id = t.team_id
group by p.name, p.player_id
) as goals_for

join

(
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
group by p.name, p.player_id
) as goals_against on goals_for.player_id = goals_against.player_id


group by goals_for.name, goals_for.player_id
order by goals_for desc, goals_against








select name, player_id, sum(goals_for) as goals_for, sum(goals_against) as goals_against
from (
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
group by p.name, p.player_id
) as goals_for
join
(select name, player_id, sum(goals_against) as goals_against from (
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
group by p.name, p.player_id
) as goals_against) on goals_for.player_id = goals_against.player_id) as goals


group by name, player_id
order by goals_against desc
