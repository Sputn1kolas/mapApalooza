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
const Sequelize = require('sequelize');
// sequelize initialization
const sequelize = new Sequelize('vagrant', 'development', 'development', {
  host: 'localhost',
  dialect: 'postgres',
  port: '5432',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
// const sequelize = new Sequelize("postgres://development:development@localhost:5432/vagrant");


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

//Check database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established to the database successfully');
  })
  .catch(err => {
    console.error("Unable to connect to the database", err);
  });
///////////////////////////////////// Render ////////////////////////////////////////////

app.get("/", (req, res) => {
  res.render("main.ejs")
})

app.get("/search", (req, res) => {
  res.render("search.ejs")
})

app.get("/profile", (req, res) => {
  res.render("profile.ejs")
})