require('newrelic')
const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')
const passport = require('passport')
const session = require('express-session')
const Strategy = require('passport-local')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('./db')
const User = require('./db/models/user')
const sessionStore = new SequelizeStore({ db })
const PORT = process.env.PORT || 8080
const app = express()
const socketio = require('socket.io')
module.exports = app

if (process.env.NODE_ENV !== 'production') require('./secrets')

// passport
passport.use(new Strategy(
  function (email, password, done) {
    User.findOne({where: {email}})
    .then(foundUser => {
      // remember: `foundUser` might be null
      foundUser.correctPassword(password) ?
      done(null, foundUser) :
      done(null, false)
    })
    .catch(console.error)
  }
))

const createApp = () => {

  // logging middleware
  app.use(morgan('dev'))

  // body parsing middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // compression middleware
  app.use(compression())

  // CORS to allow website to access the API
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token')
    next()
  })

  // api route
  app.use('/api', require('./api'))
  app.get('/', (req, res, next) => {
    res.send('Welcome to Ora')
    .catch(console.error)
  })

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', 'public')))

    // any remaining requests with an extension (.js, .css, etc.) send 404
    .use((req, res, next) => {
      if (path.extname(req.path).length) {
        const err = new Error('Not found, here')
        err.status = 404
        next(err)
      } else {
        next()
      }
    })

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () => console.log(`Connecting prayers on port ${PORT}`))
}

const syncDb = () => db.sync()

// This evaluates as true when this file is run directly from the command line
// It will evaluate false when this module is required by another module
if (require.main === module) {
  sessionStore.sync()
    .then(syncDb)
    .then(createApp)
    .then(startListening)
} else {
  createApp()
}
