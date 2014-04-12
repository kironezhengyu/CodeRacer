// MARC

var express = require('express'),
  resource = require('express-resource'),
	app = express(),
	exphbs = require('express3-handlebars'),
	_ = require('underscore'),
  http = require('http');

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
        //store: sessionStore,
        secret: 'Ekn7vgFA9nka8bHCV9bz5Mo2',

        // Cookie max age:
        // 30min/1800000ms   5min/300000 ms   1min/60000ms
        cookie: { maxAge: 1800000 }
    }));

    // ===== Routes ================================================================
    app.get('/', function(req, res){
      console.log('at home page');
		  res.render('home');
    });

    // ==== STARTING ===========================================================
    app.listen(3000);
    console.log('Listening on port 3000');
};

var start = new App();


