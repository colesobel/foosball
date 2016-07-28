exports.up = function(knex, Promise) {
  return knex.schema.createTable('games', function(table){
    table.increments('game_id');
    table.integer('winner_id');
    table.integer('loser_id');
    table.integer('winning_goals');
    table.integer('losing_goals');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('games');
};
