var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var LocalStrategy = require('passport-local').Strategy;
var logger = require('morgan');
//var jwtMiddle = require('./routes/jwtauth');
var favicon = require('serve-favicon');
var routes = require('./routes/index');

//TODO remove
var FormData = require("form-data");
var request = require("request");
var multiparty = require("multiparty");
var testPage=require('./routes/testComponents');
var crossOrigin=require('./routes/middlewares').crossOrigin;

var app = express();

// var conf = null;
//
// if (app.get('env') === 'dev') {
//     conf = config.dev;
// }
// else{
//     conf = config.production;
// }
//require('./models/db')
//connect to DB
///...






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));

// for timestamps in logger
app.use(logger('dev'));








app.use(bodyParser.json({limit: '50mb'}));

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
//app.use(passport.initialize());

//app.use(cookieParser("supercalifragilistichespiralitoso"));

//app.use(cookieParser());
// static files
app.use(crossOrigin);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/doc', express.static('doc',{root:'doc'}));
app.use('/node_modules', express.static('node_modules',{root:'node_modules'}));


app.use('/', routes);
app.use('/test', testPage);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).send({statusCode:404,error:"Not Found", error_message:"resource not found"});
});

module.exports = app;
