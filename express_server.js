// Known bugs: "my maps changes right back to itself instead of into main"

///////////////////////////////////// Intiate Settings + Server ////////////////////////////////////////////
const gMapsApi = require("private.js").gMapsApi
const express = require("express")
const cookieSession = require('cookie-session')
// const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt')
const port = process.env.PORT || 8080

const app = express()
const sass = require("node-sass-middleware");
const morgan = require("morgan");

app.set("view engine", "ejs")

/////////////////////////////////// MiddleWare USE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


app.use(cookieSession({
  name: 'session',
  keys: [process.env.SECRET_KEY]

  // Cookie Options
  // maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

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
      res.render("main.ejs", templateVar)
      })
    .catch(function (err) {
      throw(err)
    })
})

app.get("/favourites", (req, res) => {
  let user_id = 1 //temp as we don't have user id's yet, will come from cookie.

  knex.select('*').from('maps')
      .rightJoin('user_fav', 'maps.id', 'user_fav.map_id')
      .where({'user_fav.user_id': user_id})
      .then(function(result) {
        console.log(result)
       let templateVar = {
          gMapsApi: gMapsApi,
          map_db: result,
          page: "favourites"
      }
      res.render("main.ejs", templateVar)
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
// // returns all of the points for a specific mind
// app.get("/maps/:map/point", (req, res) => {
//   let map_id = req.params.map
//   knex.select('title', 'description', 'img_url')
//       .from('points')
//       .where('map_id','=', map_id)
//       .then(function (result){
//         res.send(result);
//       }).catch(function (error){
//         console.error(error)
//       });
// });




app.get("/maps/all", (req, res) => {
  knex.select('*').from('maps')
    .then(function(result) {
      res.json(result)
      })
    .catch(function (err) {
      throw(err)
    })
})

app.get("/user/maps", (req, res) => {
  let user_id = 1 //temp as we don't have user id's yet, will come from cookie.
  knex.select('*').from('maps')
  .where({user_id: user_id})
  .then(function(result) {
    res.json(result)
    })
  .catch(function (err) {
    throw(err)
  })
})

app.get("/user/favourites", (req, res) => {
  let user_id = 1 //temp as we don't have user id's yet, will come from cookie.
  knex.select('*').from('maps')
  .rightJoin('user_fav', 'maps.id', 'user_fav.map_id')
  .where({'user_fav.user_id': user_id})
  .then(function(result) {
    res.json(result)
  })
  .catch(function (err) {
    throw(err)
  })
})


app.get("/favourites/:map_id", (req, res) => {
  let user_id = 1
  let map_id = req.params.map_id //temp as we don't have user id's yet, will come from cookie.
  console.log("checking if this is favourited..", map_id)

  knex.select('*').from('user_fav')
  .where({'user_fav.user_id': user_id, 'user_fav.map_id': map_id })
  .then(function(result) {
    console.log(result)
    res.json(result)
  })
  .catch(function (err) {
    throw(err)
  })
})


app.get("/maps/:map_id", (req, res) => {
  let map_id = req.params.map_id
  let user_id = 1 //temp as we don't have user id's yet, will come from cookie.
  knex.select('*').from('maps')
    .where({id: map_id})
    .then(function(result){
        res.json(result)
      })
    .catch(function (err) {
      throw(err)
    })
})


app.get("/:map_id/points", (req, res) => {
  let user_id = 1 //temp as we don't have user id's yet, will come from cookie.
  let map_id = req.params.map_id
  knex.select('*').from('points')
    .where({map_id: map_id})
    .then(function(result){
        res.json(result)
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





///////////////////////////////////// POST ////////////////////////////////////////////

//  post for new map
app.post("/maps/new", (req, res) => {
  const user_id = 1
  const title = req.body["title"]
  const description = req.body["description"]
  // const img_url = req.body["img_url"]
  // const lat = ""
  // const long = ""
  knex('maps').insert({user_id: user_id, title: title, description: description}).then(function(){
        knex.select('*').from('maps')
        .where({title: title})
        .then(function(result){
          res.json(result)
         })
        .catch(function (err) {
           throw(err)
        })
      }).catch(function (error){
        console.error(error)
      });
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
  knex('points').insert({map_id: map_id, title: title, description: description, lat: lat, long: long}).returning('id').then(function (result){
        res.send(result)
      }).catch(function (error){
        console.error(error)
      });
})

app.post("/fav", (req, res) => {
  const user_id = 1
  let favourited = req.body["favourited"]
  let map_id = req.body["map_id"]
  if(favourited === "No") {
    knex('user_fav').insert({user_id: user_id, map_id: map_id}).then(function(){
            res.send(204)
        }).catch(function (error){
          console.error(error)
    });
  } else {
    knex('user_fav').del({user_id: user_id, map_id: map_id}).then(function(){
                res.send(204)
        }).catch(function (error){
          console.error(error)
    });
  }
})
 /////////////////////////// USER Authentication //////////////////////

// Logs out user by deleting cookie
app.post("/logout", (req, res) => {
  // res.clearCookie('user_id')
  req.session = null
  res.redirect("/")
  console.log("logged out!")
});

app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let username = req.body.username;
  console.log("server regiter is receiving.. ", email, password, username)
  if(email == "" || password == ""){
    res.status(400).send("Password or email cannot be empty");
  // }else if(emailExistsInDB(email)){
  //   res.status(400).send("Email already exist in database");
  // }
  }else{

    password = bcrypt.hashSync(password, 10);

    knex('users')
    .insert({username: username, password: password, email: email})
    .returning('id')
    .then(function(result){
      req.session.user_id = result[0];
    })
    .catch(function(error){
      console.error(error)
    });
  }
 });

app.post("/login", (req, res) => {

  let password = req.body.password;
  let passwordInDatabase = userForAnExistingEmail(req.body.email)["password"];
  let passwordMatch = bcrypt.compareSync(password, passwordInDatabase);

  if(!emailExistsInDB(req.body.email)){
    let templateVars = { shortURL: req.params.id,
  urls: urlsForUser(req.session.user_id),
  user: users[req.session.user_id]};
  res.render("urls_show", templateVars);
    res.status(403).send("Email not in database");
  }else if(!passwordMatch){
    res.status(403).send("Password incorrect");
  } else {
    req.session.user_id = userForAnExistingEmail(req.body.email).id;
    res.redirect("/urls");
  }
})


// ##################################  HELPER-FUNCTION DECLARATIONS    ##############################
// ##########################################################################################




// function emailExistsInDB(email){
//   for(let user in users){
//     if(users[user].email == email) return true;
//   }
//   return false;
// }

// function userForAnExistingEmail(email){
//   for(let user in users){
//     if(users[user].email == email) return users[user];
//   }
//   return false;
// }

// function urlsForUser(id){
//   return urlDatabase[id];
// }
