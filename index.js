const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const db = require('./models/index');
const scrapeMercato = require('./webScraping/index');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const dbConfig = require("./config/db-config.js");


const materials = require('./routes/material_api');
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
const sessionStore = new MySQLStore({
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DATABASE,
});
app.use(session({
  store: sessionStore,
  secret: 'meacha123',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));

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
app.use('/materials', materials);
app.use('/login', login);
app.use('/logout', logout);
app.use('/createUser', createUser);
app.use('/mainForm', mainForm);
app.use('/displayProject', displayProject);
app.use('/forgetPassword', forgetPassword);
app.use('/deleteProject', deleteProject);
app.use('/vip', vip);

// Render home page
app.get('/', (req, res) => {
  res.render('home');
});

// Start the server
const port = process.env.PORT || 3000;

// Database synchronization
(async () => {
  try {
    await db.sequelize.sync();
    console.log('Database synchronized successfully.');
    
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to sync database:', error);
  }
})();

// APIs
const app1 = require('./algorithm/api/material_api');
const app2 = require('./algorithm/api/project_api');
const app3 = require('./algorithm/api/paymentSMS_api');

const port1 = process.env.PORT || 4003;
const port2 = process.env.PORT || 4004;
const port3 = process.env.PORT || 4002;

app1.listen(port1, () => {
  console.log(`App 1 running on port ${port1}`);
});

app2.listen(port2, () => {
  console.log(`App 2 running on port ${port2}`);
});

app3.listen(port3, () => {
  console.log(`App 3 running on port ${port3}`);
});

// web scraping function
scrapeMercato();
