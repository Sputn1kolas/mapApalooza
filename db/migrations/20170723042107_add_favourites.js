
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user_fav', function(table){
      table.integer('user_id')
           .references('id')
           .inTable('users'),
      table.integer('map_id')
           .references('id')
           .inTable('maps')
    }) ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('user_fav')
  ])
};
