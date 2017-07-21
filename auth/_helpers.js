const bcrypt = require('bcryptjs');
const config = require("../knexfile");
const env = process.env.ENV || 'development';
const knex = require('knex')(config[env]);


function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function createUser(req){
  const salt = bcrypt.genSaltSync();
  const halt = bcrypt.hashSync(req.body.password, salt);
  return knex('users')
  .insert({
    username: req.body.username,
    password: hash,
    email: req.body.username
  })
  .returning('*');
}

module.exports = {
  comparePass,
  createUser
};