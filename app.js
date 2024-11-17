var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var session = require("express-session");
var flash = require("connect-flash");
var bodyParser = require("body-parser");
var MongoStore = require("connect-mongo");
var expressLayouts = require("express-ejs-layouts");

var bookRoutes = require('./routes/book');
var userRoutes = require('./routes/user');

var app = express();

mongoose.connect('mongodb+srv://arhyelphilip024:Ferry@myworks.yl0en.mongodb.net/bookstore?retryWrites=true&w=majority&appName=myworks')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://arhyelphilip024:Ferry@myworks.yl0en.mongodb.net/bookstore?retryWrites=true&w=majority&appName=myworks' }),
    cookie: { secure: false }
}));
app.use(flash());

app.use((req, res, next) => {
	console.log(req.session.user)
    res.locals.user = req.session.user || null;
	console.log(req.session.user)
    next();
});

app.use('/', userRoutes);
app.use('/books', bookRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('index');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
