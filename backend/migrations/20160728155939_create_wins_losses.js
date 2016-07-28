exports.up = function(knex, Promise) {
  return knex.schema.createTable('wins_losses', function(table){
    table.increments('game_id');
    table.integer('winner_id');
    table.integer('loser_id');
    table.integer('winning_goals');
    table.integer('losing_goals');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('wins_losses');
};
