exports.up = function(knex, Promise) {
  return knex.schema.createTable('players', function(table){
    table.increments('player_id');
    table.string('name');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('players');
};
