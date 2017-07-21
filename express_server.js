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

let points_db ={};
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
app.listen(port, function(){
  console.log(`Mapping away on port: ${port}`)
})

///////////////////////////////////// Databases ////////////////////////////////////////////

const config = require("./knexfile");
const env = process.env.ENV || 'development';
const knex = require('knex')(config[env]);

// Temp user


///////////////////////////////////// Render ////////////////////////////////////////////


app.get("/", (req, res) => {
   let templateVar = {
    gMapsApi: gMapsApi
  }
  res.render("main.ejs", templateVar)
})

app.get("/search", (req, res) => {
  let templateVar = {
    gMapsApi: gMapsApi
  }
  res.render("search.ejs", templateVar)
})

app.get("/profile", (req, res) => {
  let templateVar = {
    gMapsApi: gMapsApi,
    points_db: points_db //delete later
  }
  res.render("profile.ejs", templateVar)
})

map_db = {
}

app.get("/maps/:map", (req, res) => {
  points_db["nik"].id = 1
  let map_id = req.params.map
  let returnObject = {
    map_db: map_db
    points_db: knex('map_points').where({
      first_name: 'Test',
      }).select('id')
  }
  res.send(returnObject)
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
  knex('table').insert({id: , user_id: user_id, title: title, description: description, lat: lat, long: long})
})



//  post for new points
app.post("/maps/:map/point/new", (req, res) => {
  const user_id = "nik"
  let map_id = req.params.map
  let title = req.body["title"]
  let description = req.body["description"]
  let img_url = req.body["img_url"]
  let address = req.body["address"]
  let lat = req.body["lat"]
  let long = req.body["long"]
  knex('map_points').insert({id: , user_map_id: map_id, title: title, description: description, lat: lat, long: long})
  res.send(knex.column('title', 'description', 'img_url').select().from('map_points'))
})


// Logs out user by deleting cookie
app.post("/logout", (req, res) => {
  // res.clearCookie('user_id')
  req.session = null
  res.redirect("/urls")
  console.log("logged out!")
});


