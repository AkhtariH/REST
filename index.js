// import libraries
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');


// define route variables
var countriesRouter = require('./routes/countries');

// start express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// configs
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Define all routes
app.use('/api/v1/countries', countriesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

/*var bodyParser = require('body-parser');
var xmlparser = require('express-xml-bodyparser');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(xmlparser());*/

module.exports = app;


//Server listening
app.listen(3001,() =>{
  console.log('Server started on port 3001...');
});
