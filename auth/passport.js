const passport = require('passport');
const config = require("../knexfile");
const env = process.env.ENV || 'development';
const knex = require('knex')(config[env]);

module.exports = () => {

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    knex('users').where({id}).first()
    .then((user) => { done(null, user); })
    .catch((err) => { done(err,null); });
  });

};