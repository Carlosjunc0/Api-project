const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongodb = require('./models/database');
const bodyParser = require('body-parser');
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

app
  .use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Z-key', 'Accept', 'Authorization']
  }))
  .use(bodyParser.json())
  .use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use(express.json())
  .use('/', require('./views/index.js'));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/', (req, res) => {res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.username}` : "Logged out");});

app.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs', session: false}),
(req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  }
  else {
    app.listen(port, () => {
      console.log(`Database is listening and node running on port ${port}`);
    });
  }
});