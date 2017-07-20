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


app.set("view engine", "ejs")
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(cookieParser())
app.use(cookieSession({ secret: 'Banannnas!', cookie: { maxAge: 60 * 60 * 1000 }}))
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public")) // this is where files that html references will din .
app.use(bodyParser.urlencoded({extended:true}))

// Get app to listen on port 8080
app.listen(port, function(){
  console.log(`Mapping away on port: ${port}`)
})

///////////////////////////////////// Databases ////////////////////////////////////////////
var db  = require('./db');


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
    gMapsApi: gMapsApi
  }
  res.render("profile.ejs", templateVar)
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
  // const user_id = req.params.id
  console.log("post recieved!")
  const map_id = req.params.map
  const title = req.body["title"]
  const description = req.body["description"]
  const img_url = req.body["img_url"]
  const address = req.body["address"]
  const lat = req.body["lat"]
  const long = req.body["long"]
  console.log(title, description, img_url, lat, long)
  res.send("I got the message")
})



// Logs out user by deleting cookie
app.post("/logout", (req, res) => {
  // res.clearCookie('user_id')
  req.session = null
  res.redirect("/urls")
  console.log("logged out!")
});


