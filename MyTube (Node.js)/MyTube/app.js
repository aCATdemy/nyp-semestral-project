const express = require('express');
const { engine } = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

var helpers = require('handlebars-helpers')();
// const helpers = require('./helpers/handlebars');
app.engine('handlebars', engine({
	helpers: helpers,
	handlebars: allowInsecurePrototypeAccess(Handlebars),
	defaultLayout: 'main' // Specify default template views/layout/main.handlebar 
}));
app.set('view engine', 'handlebars');

// Express middleware to parse HTTP body in order to read HTTP data
app.use(express.urlencoded({
	extended: false
}));
app.use(express.json());

// Creates static folder for publicly accessible HTML, CSS and Javascript files
app.use(express.static(path.join(__dirname, 'public')));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

// Enables session to be stored using browser's Cookie ID
app.use(cookieParser());

// Library to use MySQL to store session objects
const MySQLStore = require('express-mysql-session');
var options = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PWD,
	database: process.env.DB_NAME,
	clearExpired: true,
	// The maximum age of a valid session; milliseconds:
	expiration: 1800000, // 30 min 
	// How frequently expired sessions will be cleared; milliseconds:
	checkExpirationInterval: 900000 // 15 min
};

// To store session information. By default it is stored as a cookie on browser
app.use(session({
	key: 'mytube_session',
	secret: process.env.APP_SECRET,
	resave: false,
	saveUninitialized: false,
}));


// Messaging libraries
const flash = require('connect-flash');
app.use(flash());

const flashMessenger = require('flash-messenger');
app.use(flashMessenger.middleware);

// Passport Config
const passport = require('passport');
const passportConfig = require('./config/passportConfig');
passportConfig.localStrategy(passport);

// Initilize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Place to define global variables
app.use(function (req, res, next) {
	res.locals.messages = req.flash('message');
	res.locals.errors = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// Bring in database connection
const DBConnection = require('./config/DBConnection');

// Connects to MySQL database
DBConnection.setUpDB(process.env.DB_RESET == 1);	// Change value from '1' to '0' to set up database with new tables

// Routes:
const mainRoute = require('./routes/main');
const accountRoute = require('./routes/account');
const postRoute = require('./routes/post');
const supportRoute = require('./routes/support')
const commentRoute = require('./routes/comment')
const videoRoute = require('./routes/video');
const searchRoute = require('./routes/search')

// URL:
app.use('/', mainRoute);
app.use('/account', accountRoute);
app.use('/post', postRoute);
app.use('/support', supportRoute);
app.use('/comment', commentRoute);
app.use('/video', videoRoute);
app.use('/search', searchRoute);

// Error 404 Handling:
app.get("*", (req, res) => {
	res.sendFile(__dirname + "/404.html")
});

// Port for Express server
const port = process.env.PORT;

// Starts the server and listens to port
app.listen(port, () => {
	console.log(`SYSTEM: Server started on localhost:${port}`);
});