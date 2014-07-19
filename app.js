
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , fs  = require('fs')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
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
  fs.writeFile("./tmp/" + new Date().getTime(), JSON.stringify(req.body), function(err){
  });
  fs.writeFile("./tmp/latest", JSON.stringify(req.body), function(err){
  });
    res.send(req.body);
});

app.get('/readall', function(req,res){
  var files = fs.readdirSync('./tmp')
  console.log(files);
  res.send(files);
});

app.get('/readone/:id', function(req,res) {
  var file = fs.readFileSync('./tmp/' + req.params.id, 'utf8');
  res.send(JSON.parse(file));
} );

http.createServer(app).listen(app.get('port'), function(){
});
