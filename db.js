const settings = require("./knexfile");
const env = 'development';
const knex = require('knex')(config[env]);

module.exports = knex;

knnex.migrate.latest([config]);