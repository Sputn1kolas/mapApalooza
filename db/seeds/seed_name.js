
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'NIK!',     password: 'password',  email:'nikolas.clark@gmail.com'},
        {id: 2, username: 'SIDNEY!',  password: 'password',  email:'Sidney.Coroso@gmail.com'},
        {id: 3, username: 'UCHEN!',   password: 'password',  email:'UCHEN.lastname@gmail.com'}
      ]);
    });
};
