// MARC

var express = require('express'),
  resource = require('express-resource'),
	app = express(),
	exphbs = require('express3-handlebars'),
	_ = require('underscore'),
  Firebase = require('firebase'),
  SocketIo = require('socket.io'),
  resquest = require('request'),
  http = require('http'),
  server = http.createServer(app);

var fbRoot = new Firebase('https://flickering-fire-9251.firebaseio.com/');
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
    app.get('/', function(req, res){
      console.log('at home page');
		  res.render('home');
    });

    app.get('/testwolfram', function(req, res) {
      var url = "http://api.wolframalpha.com/v2/query?input=france&appid=866XWU-2AJUY924VK&output=json";
      request(url, function(err, resp, body) {
        res.send(body);
      });
    });

    // ==== STARTING ===========================================================
    app.listen(3000);
    var io = SocketIo.listen(server);
    console.log('Listening on port 3000');

    // ==== Sockets ===========================================================
    io.sockets.on('connection', function(socket) {
      socket.emit('message', {message: 'TEST: You have connected!'});
      socket.on('send', function(data) {
        io.sockets.emit('message', data);
      });
    });
};

var start = new App();


