const dbConfig = require("./config/db-config.js");
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./migrations/20230716114141_migration'); // Assuming this is your User model
const db = require('./models/index');
const scrapeMercato = require('./webScraping/index');

const projects = require('./routes/project_api');
const payments = require('./routes/paymentSMS_api');
const login = require('./routes/login');
const logout = require('./routes/logout');
const createUser = require('./routes/createUser');
const mainForm = require('./routes/mainForm');
const displayProject = require('./routes/displayProject');
const forgetPassword = require('./routes/forgetPassword');
const deleteProject = require('./routes/deleteProject');
const vip = require('./routes/vip');

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL session store setup
const sessionStore = new pgSession({
  conString: `postgres://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DATABASE}`,
  tableName: 'session'
});

app.use(session({
  store: sessionStore,
  secret: 'meacha123',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return done(null, false);
    }

    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// View engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/projects', projects);
app.use('/payments', payments);
app.use('/login', login);
app.use('/logout', logout);
app.use('/createUser', createUser);
app.use('/mainForm', mainForm);
app.use('/displayProject', displayProject);
app.use('/forgetPassword', forgetPassword);
app.use('/deleteProject', deleteProject);
app.use('/vip', vip);

// Database synchronization
(async () => {
  try {
    await db.sequelize.sync();
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Failed to sync database:', error);
  }
})();

// Web scraping function
scrapeMercato();

module.exports = app;
