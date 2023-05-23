const express = require('express');
const app = express();
const path = require('path');
const db = require('./models');
const cookieParser = require('cookie-parser');
const session = require('express-session');  //Make sure to add the express-session middleware before initializing Passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// Import the my api file
const app1 = require('./algorism/api/material_api');
const port1 = 4003;

const users = require('./routes/users');
const posts = require('./routes/posts');
const login = require('./routes/login');
const logout = require('./routes/logout');
const createUser = require('./routes/createUser');
const mainForm = require('./routes/mainForm');

app.use(session({                   //Make sure to add the express-session middleware before initializing Passport.js
    secret: '123456789', 
    resave: false,
    saveUninitialized: false,
  }));

passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ where: { email: username } });
          if (!user || !user.isValidPassword(password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
app.use(passport.initialize());
app.use(passport.session());


app.use(cookieParser());
app.use(express.json());


app.use(express.static("./public"));

app.set('view engine', 'pug');
// ../views
app.set('views', path.join(__dirname, 'views'));

(async () => {
    await db.sequelize.sync();
})();


app.use(express.urlencoded({ extended: true }));  // very important to put this global middleware before the routes
                                                  // we need this two middleware for out post request, to acces our data

app.use('/users', users);
app.use('/posts', posts);
app.use('/login',login);
app.use('/logout',logout)
app.use('/createUser',createUser);
app.use('/mainForm',mainForm);

app.get('/', (req, res) => {
    res.render('home');
});

// Start the api app on port 4003
app1.listen(port1, () => {
  console.log(`App 1 running on port ${port1}`);
});


app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});