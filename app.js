var express = require('express'),
	app = express(),
	exphbs = require('express3-handlebars'),
	_ = require('underscore'),
  Firebase = require('firebase'),
  SocketIo = require('socket.io'),
  request = require('request'),
  http = require('http'),
  Rdio = require('rdio') ({
    rdio_api_key: "tw5mdr7bqad9van8kt7hzrs2",
    rdio_api_shared: "gG67CNrJKB"
  });

var wolframAppId = "866XWU-2AJUY924VK";

// ===== App config ============================================================
var App = function() {
    app.engine('hbs', exphbs({
        extname: '.hbs',
        defaultLayout: 'layout',
        layoutsDir: 'views/'
    }));
    app.set('view engine', 'hbs');
    app.set('views', __dirname + '/views');
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('whatever'));
    app.disable('x-powered-by');

    // Setup the session.
    app.use(express.session({
        secret: 'Ekn7vgFA9nka8bHCV9bz5Mo2',
        cookie: { maxAge: 1800000 }
    }));

    // ===== Routes =============================================================
    app.get('/login', function(req, res) {
      var hash = req.query.id;
      req.session.user = hash;
      console.log('id: ' + hash);
      res.redirect('/');
    });

    app.get('/logout', function(req, res) {
      req.session.destroy(function() {
        res.redirect('/');
      });
    });

    app.get('/', apiRestrict, function(req, res){
      console.log('at home page');
      /*
      $('#pano')('qin', 50, function(err, buffer) {
        if (err) console.log(err);
        else {
          var hash = CryptoJS.SHA256(Math.random() + CryptoJS.SHA256(buffer));
          console.log('hash' + hash);
          console.log("buffer: " + buffer + "::::" + typeof(buffer));
        }
      });
      */
      res.render('home', {user: req.session.user});
    });

    app.get('/code', apiRestrict, function(req, res){
      console.log('at code page');
      res.render('code2', {user: req.session.user});
    });

    app.get('/testwolfram', apiRestrict, function(req, res) {
      var str = "abs(-7)^3 - floor(19/3)";
      var url = "http://api.wolframalpha.com/v2/query?input="+str+"&appid="+wolframAppId+"&output=json";
      request(url, function(err, resp, body) {
        var jsonBody = JSON.parse(body);
        res.send(body);
      });
    });

    app.get('/testeval', apiRestrict, function(req, res) {
      var str = "(function () { var sum=0; for (var i=0; i<5; i++) { sum+=i; } return sum}())";
      var result = eval(str);
      console.log(result);
      res.send(result + "");
    });

    app.get('/testrdio', apiRestrict, function(req, res) {
      // :(
    });

    // ==== Sockets ===========================================================
    var io = SocketIo.listen(app.listen(3000));
    io.sockets.on('connection', function(socket) {
      socket.emit('message', {message: 'You have connected!'});
    });
    console.log('Listening on port 3000');
};

var start = new App();

function apiRestrict(req, res, next) {
  console.log("req.session.user: " + JSON.stringify(req.session)); // TEMP
  if (req.session.user) {
    console.log('logged in');
    next();
  } else {
    console.log('logged out');
    res.render('home', {user: req.session.user});
  }
}
