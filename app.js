var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
let mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var roleRouter = require("./routes/role");
var userRouter = require("./routes/user");
var app = express();


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.use('/', indexRouter);
app.use('/', roleRouter);
app.use("/", userRouter);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/NNPTUD');

mongoose.connection.on('connected', function () {
  console.log("MongoDB connected");
});

mongoose.connection.on('disconnected', function () {
  console.log("MongoDB disconnected");
});


// catch 404
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
    message: err.message
  });

});


// start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});


module.exports = app;