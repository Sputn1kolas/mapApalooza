// Known bugs:

///////////////////////////////////// Intiate Settings + Server ////////////////////////////////////////////

const express = require("express")
const cookieSession = require('cookie-session')
// const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt')
const port = process.env.PORT || 8080
const cookieOptions = ["rocks"]
const app = express()


app.set("view engine", "ejs")
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(cookieParser())
app.use(cookieSession({ secret: 'Banannnas!', cookie: { maxAge: 60 * 60 * 1000 }}))
app.use(express.static("public")) // this is where files that html references will din .

// Get app to listen on port 8080
app.listen(port, function(){
  console.log(`Mapping away on port: ${port}`)
})

///////////////////////////////////// Databases ////////////////////////////////////////////



///////////////////////////////////// Render ////////////////////////////////////////////

app.get("/", (req, res) => {
  res.render("../views/main")
})

app.get("/search", (req, res) => {
  res.render("../views/search")
})

app.get("/profile", (req, res) => {
  res.render("../views/profile")
})