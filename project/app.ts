///<reference path='types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='types/DefinitelyTyped/express/express.d.ts'/> 

interface Error {

     status?: number;

}
class Application {

  constructor(){}
  start() {

    var express = require('express');
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var mongo = require('mongodb');
    var monk = require('monk');
    var db = monk('OP123456:BT123456@ds059205.mongolab.com:59205/heroku_t6fhvx60');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var session = require('express-session');
    var errorHandler = require('errorhandler');
    var MongoStore = require('connect-mongo')(session);
    
    var methodOverride = require('method-override');

    var routes = require('./routes/index');
    var users = require('./routes/users');


    var app = express();

    app.set('port', process.env.PORT || 3000);
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(methodOverride('_method'));
    
    app.use(session({
	   secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
	   proxy: true,
	   resave: true,
	   saveUninitialized: true,
	   store: new MongoStore({ host: 'OP123456:BT123456@ds059205.mongolab.com', port: 59205, db: 'heroku_t6fhvx60'})
	   })
    );
    
    app.use(require('stylus').middleware({ src: __dirname + '/public' }));
    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    // Make our db accessible to our router
    app.use(function(req,res,next){
         req.db = db;
         next();
    });


    app.use('/', routes);
    app.use('/users', users);


    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });

    // universal global variables
    app.locals = {
      siteTitle: "OVERPRICED HOTDOGS",
      homeURL: "/homepage",
      logo: "http://i.imgur.com/iwDCnm8.png"
    };

    module.exports = app;
   
  }

}

var application = new Application();
application.start();