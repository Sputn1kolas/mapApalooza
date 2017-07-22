const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const init = require('./passport');

const config = require("../knexfile");
const env = process.env.ENV || 'development';
const knex = require('knex')(config[env]);

const authHelpers = require('./_helpers');

const options = {};

init();


passport.use(new LocalStrategy(options, (username, password, done) => {
  //Check to see if the username exists
  knex('users').where({ username }).first()
  .then((user) => {
    if(!user) return done(null, false);
    if (!authHelpers.comparePass(password, user.password)) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  })
  .catch((err) => { return done(err); });
}));

module.exports = passport;