// Michael Peters
// guwt-admin-panel-backend
// server.js
// 2020

// npm imports
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy
var cors = require('cors')
var path = require('path')
require('dotenv').config()

// local imports
const db = require('./db')
const organizationRouter = require('./routes/organization-router')
const apikeyRouter = require('./routes/apikey-router')
const Apikey = require('./models/apikey-model')

// instantiate express.js
const app = express()

// port the app is currently serving to
const port = 6968

// app use directives
// Cross-Origin
app.use(cors())
// Body Parsing of Request/Response objects
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

// connect to MongoDB
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// route for '/'
app.get('/', (req, res) => {
    res.send('guwt-admin-panel-backend')
})

// initialization and implementation of api-keys
passport.initialize()
passport.use(new HeaderAPIKeyStrategy(
  { header: 'Authentication', prefix: 'Api-Key ' },
  false,
  function(apikey, done) {
      // find a key in database matching "apikey"
      Apikey.findOne({ key: apikey }, function (err, apikey) {
      if (err) { return done(err); }
      if (!apikey) { return done(null, false); }
      // tempfix
      return done(null, apikey);
      });
  }
  ));

// router directives
app.use('/api', organizationRouter)
app.use('/auth', apikeyRouter)

// initialize server object and listen on "port"
const server = app.listen(port, () => console.log(`guwt-admin-panel-backend server app listening on port ${port}!\n`))

// if router rejects api-key return 401 Unauthorized
app.get('/unauthorized', (req, res) => {
  res.status(401).json({ message: "Unauthorized" });
  })

// for all else return 404
app.use(function (req, res) {
    res.status(404).send("404");
  })

// export server object
module.exports = server