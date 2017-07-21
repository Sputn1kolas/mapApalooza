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
    points_db: points_db, //delete later
    map_db: map_db
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
})



//  post for new points
app.post("/maps/:map/point/new", (req, res) => {
  const user_id = "nik"
  points_db[user_id] = {}
  points_db[user_id].map_id = req.params.map
  points_db[user_id].title = req.body["title"]
  points_db[user_id].description = req.body["description"]
  points_db[user_id].img_url = req.body["img_url"]
  points_db[user_id].address = req.body["address"]
  points_db[user_id].lat = req.body["lat"]
  points_db[user_id].long = req.body["long"]
  res.send(points_db[user_id])
})


// Logs out user by deleting cookie
app.post("/logout", (req, res) => {
  // res.clearCookie('user_id')
  req.session = null
  res.redirect("/urls")
  console.log("logged out!")
});


