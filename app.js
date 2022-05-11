if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');
const ejsMate = require('ejs-mate');
var compression = require('compression');
var helmet = require('helmet');
var app = express();

// view engine setup
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set up default mongoose connection
const mongoDB = process.env.DB_URL || 'myLocalDatabase';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
//connect to db
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(compression()); //Compress all routes
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dpofkfwhq/"
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dpofkfwhq/"
];
const connectSrcUrls = [
  "https://res.cloudinary.com/dpofkfwhq/"
];
const fontSrcUrls = ["https://res.cloudinary.com/dpofkfwhq/"];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dpofkfwhq/",
              "https://images.unsplash.com/"
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
          mediaSrc: ["https://res.cloudinary.com/dpofkfwhq/"],
          childSrc: ["blob:"]
      },

      crossOriginEmbedderPolicy: false
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/category',categoriesRouter);

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
