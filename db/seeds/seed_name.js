const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync();
const hashedPassword = bcrypt.hashSync('password', salt);


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'NIK!',     password: hashedPassword,  email:'nikolas.clark@gmail.com'},
        {id: 2, username: 'SIDNEY!',  password: hashedPassword,  email:'Sidney.Coroso@gmail.com'},
        {id: 3, username: 'YUCHEN!',   password: hashedPassword,  email:'UCHEN.lastname@gmail.com'}
      ]);
    });
};
