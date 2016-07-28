exports.up = function(knex, Promise) {
  return knex.schema.createTable('teams', function(table){
    table.increments('team_id');
    table.string('team_name');
    table.integer('player_one_id');
    table.integer('player_two_id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('teams');
};
