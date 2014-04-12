// MARC

var express = require('express'),
  resource = require('express-resource'),
	app = express(),
	exphbs = require('express3-handlebars'),
	_ = require('underscore'),
  Firebase = require('firebase'),
  SocketIo = require('socket.io');
  http = require('http');

var fbRoot = new Firebase('https://flickering-fire-9251.firebaseio.com/');

// ===== App config ============================================================
var App = function() {
    app.engine('hbs', exphbs({
        extname: '.hbs',
        defaultLayout: 'layout',
        layoutsDir: 'views/'
    }));
    app.set('view engine', 'hbs');
    app.set('views', __dirname + '/views');
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

    // ==== STARTING ===========================================================
    var io = SocketIo.listen(3000);
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


