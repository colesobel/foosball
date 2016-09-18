exports.up = function(knex, Promise) {
  return knex.schema.createTable('wins_losses', function(table){
    table.increments();
    table.integer('team_id');
    table.integer('wins');
    table.integer('losses');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('wins_losses');
};
