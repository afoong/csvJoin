
/**
 * Module dependencies.
 */

var express = require('express')
  , gzippo = require('gzippo')
  , routes = require('./routes')
  , log4js = require('log4js');

var app = module.exports = express.createServer();

var logger = log4js.getLogger();

// Configuration

var viewOptions = {
  layout: false         
};

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

  // app.use(log4js.connectLogger(logger, {level:log4js.levels.WARN}))
  app.use(gzippo.staticGzip(__dirname + '/public'));
  app.use(gzippo.compress());

  app.set('view options', viewOptions);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
  logger.setLevel(log4js.levels.WARN);
});

app.dynamicHelpers({
  thisRoute: function(req, res) {
    return req.path;
  }
})

app.helpers({
  conditionalClass: function() {

    if (arguments[0] === arguments[1]) {
      return arguments[2];
    }
    else if(arguments[3]) {
      return arguments[3];
    }
  }
})

// Routes

app.get('/', routes.index);
app.get('/pages/join', routes.join);
app.post('/process/join.ajax', routes.processCsvs);

console.log(routes)

// Unhandled Exception catching

process.on('uncaughtException', function(err) {
  console.log(err);
}); 

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
