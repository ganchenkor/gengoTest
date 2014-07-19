
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , fs  = require('fs')
  , path = require('path')
  , Store = require('jfs')
  , db = new Store('data', {pretty:true});

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/user', function(req,res,next){

  req.rawBody = '';

  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });

  // next();
});

app.post('/write', function(req, res) {
  db.saveSync("latest", req.body, function(err){});
  db.saveSync(req.body, function(err){});
  res.send(req.body);
});

app.get('/readall', function(req,res){
  // var files = fs.readdirSync('./data')
  // db.allSync(function(err, objs) {
  //   res.send(objs);
  // })
  res.send(db.allSync());
});

app.get('/readone/:id', function(req,res) {
  var file = db.getSync(req.params.id)
  // var file = require('./tmp/' + req.params.id);
  res.send(file);
} );

http.createServer(app).listen(app.get('port'), function(){
});
