const config = require("./knexfile");
const env = 'development';
const knex = require('knex')(config[env]);

module.exports = knex;

knex.migrate.latest([config]);