// Known bugs:

///////////////////////////////////// Intiate Settings + Server ////////////////////////////////////////////
const gMapsApi = require("private.js").gMapsApi
const express = require("express")
const cookieSession = require('cookie-session')
// const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt')
const port = process.env.PORT || 8080
const cookieOptions = ["rocks"]
const app = express()
const sass = require("node-sass-middleware");
const morgan = require("morgan");

app.set("view engine", "ejs")

/////////////////////////////////// MiddleWare USE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.use(cookieSession({ secret: 'Banannnas!', cookie: { maxAge: 60 * 60 * 1000 }}))

app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: false,
  outputStyle: 'expanded'
}));
app.use(express.static("public")) // this is where files that html references will din .
app.use(bodyParser.urlencoded({extended:true}))
app.use(morgan('dev'));
// Get app to listen on port 8080
app.listen(port, function() {
  console.log(`Mapping away on port: ${port}`)
})

///////////////////////////////////// Databases ////////////////////////////////////////////

const config = require("./knexfile");
const env = process.env.ENV || 'development';
const knex = require('knex')(config[env]);

// Temp user


///////////////////////////////////// Render ////////////////////////////////////////////

app.get("/", (req, res) => {
  knex.select('*').from('maps')
    .then(function(result) {
      let templateVar = {
          gMapsApi: gMapsApi,
          map_db: result,
          page: "main",
      }
      res.render("main.ejs", templateVar)
      })
    .catch(function (err) {
      throw(err)
    })
})

app.get("/maps/all", (req, res) => {
  knex.select('*').from('maps')
    .then(function(result) {
      res.json(result)
      console.log("db get..", result)
      })
    .catch(function (err) {
      throw(err)
    })
})

app.get("/search", (req, res) => {
  let templateVar = {
    gMapsApi: gMapsApi
  }
  res.render("search.ejs", templateVar)
})

app.get("/:map_id/points", (req, res) => {
  let user_id = 1 //temp as we don't have user id's yet, will come from cookie.
  let map_id = req.params.map_id
  knex.select('*').from('points')
    .where({map_id: map_id})
    .then(function(result) {
        let points = result
        res.json(points)
        console.log(points)
      })
    .catch(function (err) {
      throw(err)
    })
})

app.get("/profile", (req, res) => {
  let user_id = 1 //temp as we don't have user id's yet, will come from cookie.

  knex.select('*').from('maps')
    .where({user_id: user_id})
    .then(function(result) {
       let templateVar = {
          gMapsApi: gMapsApi,
          map_db: result,
          page: "profile"
      }
      console.log(templateVar)
      res.render("main.ejs", templateVar)
      })
    .catch(function (err) {
      throw(err)
    })
})

// app.get("/maps", (req, res) => {
//   knex.select('maps.title AS title', 'maps.description AS description', 'maps.img_url AS img_url')
//       .from('maps')
//       .join('users', function (){
//         this.on('users.id','=', 'user_id')
//       }).join('points', function (){
//         this.on('maps.id','=', 'map_id')
//       }).then(function (result){
//         res.send(result);
//       }).catch(function (error){
//         console.error(error)
//       });
// });

app.get("/maps/:map/point", (req, res) => {
  let map_id = req.params.map
  knex.select('title', 'description', 'img_url')
      .from('points')
      .where('map_id','=', map_id)
      .then(function (result){
        res.send(result);
      }).catch(function (error){
        console.error(error)
      });
});

app.get("/maps/:map_id", (req, res) => {
  let map_id = req.params.map_id
  let user_id = 1 //temp as we don't have user id's yet, will come from cookie.
  knex.select('*').from('maps')
    .where({map_id: map_id})
    .then(function(result) {
        res.json(result)
      })
    .catch(function (err) {
      throw(err)
    })
})


///////////////////////////////////// POST ////////////////////////////////////////////

//  post for new map
app.post("/main/:user/", (req, res) => {
  const user_id = req.params.id
  const title = req.body["title"]
  const description = req.body["description"]
  const img_url = req.body["img_url"]
  const lat = ""
  const long = ""
  knex('maps').insert({user_id: user_id, title: title, description: description, lat: lat, long: long})
  res.send(knex.column('title', 'description', 'img_url').select().from('map_points'))
})



//  post for new points
app.post("/maps/:map/point/new", (req, res) => {
  let map_id = req.params.map
  let title = req.body["title"]
  let description = req.body["description"]
  let img_url = req.body["img_url"]
  let address = req.body["address"]
  let lat = req.body["lat"]
  let long = req.body["long"]
  knex('points').insert({map_id: map_id, title: title, description: description, lat: lat, long: long})
  res.send(knex.column.select().from('map_points'))
})


// Logs out user by deleting cookie
app.post("/logout", (req, res) => {
  // res.clearCookie('user_id')
  req.session = null
  res.redirect("/urls")
  console.log("logged out!")
});


