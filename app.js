
/**
 * Module dependencies.
 */

var express = require('express')
  , gzippo = require('gzippo') // gzip static files
  , routes = require('./routes') // index routes
  , pRoutes = require('./routes/join.js') // routes for processing upload
  , log4js = require('log4js'); // cool logger

var app = module.exports = express.createServer();

var logger = log4js.getLogger();

// Configuration

// dont use layout for every jade file
var viewOptions = {
  layout: false         
};

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.methodOverride());
  app.use(app.router);

  // log4j - shows requests, you may want to turn this off if you like dont like server output
  app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}))
  // gzip static files - smaller files = faster transfer
  app.use(gzippo.staticGzip(__dirname + '/public'));
  app.use(gzippo.compress());

  // use the disable layout option from above
  app.set('view options', viewOptions);

  // 404 page - because... why not?
  app.use(function(req, res, next){
    res.render('404.jade', {title: "404 - Page Not Found", showFullNav: false, status: 404, url: req.url });
  });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
  logger.setLevel(log4js.levels.WARN);
});

app.dynamicHelpers({
// used in the left nav to see what the current route is
  thisRoute: function(req, res) {
    return req.path;
  }
});

app.helpers({
// used in left nav to return a class name if a condition passes
  conditionalClass: function() {

    if (arguments[0] === arguments[1]) {
      return arguments[2];
    }
    else if(arguments[3]) { // this arugment is returned if it exists and the condition failed
      return arguments[3];
    }
  }
});

// Routes
app.get('/', routes.index);
app.get('/pages/join', pRoutes.join);

app.post('/process/join.ajax', pRoutes.processCsvs); // for hacked ajax uploads


// Unhandled Exception catching
process.on('uncaughtException', function(err) {
  console.log(err.stack);
  throw err;
}); 

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
