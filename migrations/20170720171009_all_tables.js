
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table){
      table.increments('id').primary(),
      table.string('username'),
      table.string('password'),
      table.string('email')
    }),
    knex.schema.createTable('user_maps', function(table){
      table.increments('id').primary(),
      table.integer('user_id')
           .references('id')
           .inTable('users'),
      table.string('title'),
      table.string('description', 1000),
      table.string('img_url', 1000),
      table.float('lat', 10, 6),
      table.float('long', 10, 6)
    }),
    knex.schema.createTable('map_points', function(table){
      table.increments('id').primary()
      table.integer('user_map_id')
           .references('id')
           .inTable('user_maps'),
      table.string('title'),
      table.string('description', 1000),
      table.string('img_url', 1000),
      table.string('address'),
      table.float('lat', 10, 6),
      table.float('long', 10, 6)
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('map_points'),
    knex.schema.dropTable('user_maps'),
    knex.schema.dropTable('users')
  ])

};
