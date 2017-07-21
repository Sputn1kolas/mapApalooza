const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync();
const hashedPassword = bcrypt.hashSync('password', salt);


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries

  return Promise.all([

  knex('points').del()
  .then(() => {return knex('maps').del()})
  .then(() => { return knex('users').del()})
  .then(function () {
    // Inserts seed entries
    return knex('users').returning('id').insert([
      {id: 1, username: 'NIK',     password: hashedPassword,  email:'nikolas.clark@gmail.com'},
      {id: 2, username: 'SIDNEY',  password: hashedPassword,  email:'Sidney.Coroso@gmail.com'},
      {id: 3, username: 'UCHEN',   password: hashedPassword,  email:'UCHEN.lastname@gmail.com'}
    ]);
  })
  .then(() => {
    return knex('maps').insert([
      {user_id: 1,  title: 'Bars',  description:'My favourite bars.', img_url: '', lat: 1000.0000, long: 1000.0000 },
      {user_id: 1,  title: 'Hikes',  description:'A great map of all my hikes', img_url: '' , lat: 1000.0000, long: 1000.0000}
    ]);
  })

  // .then(knex('maps').del()
  //   .then(function () {
  //     console.log("inserting into maps")
  //     // Inserts seed entries
  //     return knex('maps').insert([
  //       {user_id: 1,  title: 'Bars',  description:'My favourite bars.', img_url: '', lat: 1000.0000, long: 1000.0000 },
  //       {user_id: 1,  title: 'Hikes',  description:'A great map of all my hikes', img_url: '' , lat: 1000.0000, long: 1000.0000}
  //     ]);
  //   }))
  // ,knex('users').del()
  // .then(function () {
  //   // Inserts seed entries
  //   return knex('users').insert([
  //     {username: 'NIK',     password: 'password',  email:'nikolas.clark@gmail.com'},
  //     {username: 'SIDNEY',  password: 'password',  email:'Sidney.Coroso@gmail.com'},
  //     {username: 'UCHEN',   password: 'password',  email:'UCHEN.lastname@gmail.com'}
  //   ]);
  // })
])};

