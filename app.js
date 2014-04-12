var express = require('express'),
  resource = require('express-resource'),
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
  }),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  server = http.createServer(app);

var fbRoot = new Firebase('https://flickering-fire-9251.firebaseio.com/');
var wolframAppId = "866XWU-2AJUY924VK";
var FACEBOOK_APP_ID = '625022630924321';
var FACEBOOK_APP_SECRET = '5cfa9703984a107068ef4a1fcfc0c50c';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
}, function(accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    return done(null, profile);
  });
}));

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
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
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
      var str = "abs(-7)^3 - floor(19/3)";
      var url = "http://api.wolframalpha.com/v2/query?input="+str+"&appid="+wolframAppId+"&output=json";
      request(url, function(err, resp, body) {
        var jsonBody = JSON.parse(body);
        res.send(body);
      });
    });

    app.get('/testeval', function(req, res) {
      var str = "(function () { var sum=0; for (var i=0; i<5; i++) { sum+=i; } return sum}())";
      var result = eval(str);
      console.log(result);
      res.send(result + "");
    });

    app.get('/testrdio', function(req, res) {
      // :(
    });

    app.get('/login', function(req, res) {
      res.redirect('/auth/facebook');
    });

    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });

    app.get('/auth/facebook',
      passport.authenticate('facebook'),
      function(req, res){
        // The request will be redirected to Facebook for authentication, so this
        // function will not be called.
    });

    app.get('/auth/facebook/callback',
      passport.authenticate('facebook', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
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


