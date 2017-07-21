
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([

  knex('users').del()
  .then(function () {
    // Inserts seed entries
    return knex('users').insert([
      {username: 'NIK',     password: 'password',  email:'nikolas.clark@gmail.com'},
      {username: 'SIDNEY',  password: 'password',  email:'Sidney.Coroso@gmail.com'},
      {username: 'UCHEN',   password: 'password',  email:'UCHEN.lastname@gmail.com'}
    ]);
  }),

  knex('maps').del()
    .then(function () {
      // Inserts seed entries
      return knex('maps').insert([
        {user_id: 'NIK',  title: 'Bars',  description:'My favourite bars.', img_url: '', lat: 1000.0000, long: 1000.0000 },
        {user_id: 'NIK',  title: 'Hikes',  description:'A great map of all my hikes', img_url: '' , lat: 1000.0000, long: 1000.0000}
      ]);
    }),

  knex('users').del()
  .then(function () {
    // Inserts seed entries
    return knex('users').insert([
      {username: 'NIK',     password: 'password',  email:'nikolas.clark@gmail.com'},
      {username: 'SIDNEY',  password: 'password',  email:'Sidney.Coroso@gmail.com'},
      {username: 'UCHEN',   password: 'password',  email:'UCHEN.lastname@gmail.com'}
    ]);
  })
])
};
