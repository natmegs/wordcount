const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
//const passport = require('passport');
//const Auth0Strategy = require('passport-auth0');
const dotenv = require('dotenv');
dotenv.config();
const config = require('./config/config');

// Connect to Database

mongoose.connect(config.database.server);

mongoose.connection.on('connected', () => {
  console.log('Connected to database');
});

mongoose.connection.on('error', (err) => {
  console.log("Error connecting to database: ", err);
});

// Set up JWT authentication strategy

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.auth0.jwksUri
  }),
  audience: config.auth0.identifier,
  issuer: config.auth0.issuer,
  algorithms: ['RS256']
});

const app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up routes

const index = require('./routes/index');
const users = require('./routes/users');

app.use('/', index);
app.use('/users', checkJwt, users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
