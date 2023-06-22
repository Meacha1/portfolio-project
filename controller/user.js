const { models: { User } } = require('../models');
const nodemailer = require('nodemailer');
const dbConfig = require('../config/db-config.js');
const bcrypt = require("bcrypt");

const host = dbConfig.HOST;

module.exports = {
  login: async (req, res) => {
    if (req.body.email && req.body.password) {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      const oldUser = await User.findOne({ where: { email, password } });
      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid || oldUser) {
          req.session.userId = user.id; // Store userId in the session
          const username = user.username;
          console.log(`my user id is: ${user.id}`);
  
          // Fetch projects from the database
          try {
            const response = await fetch(`http://${host}:4004/api/projects/${user.id}`);
            if (response.ok) {
              const projects = await response.json();
              const projectnames = projects.map((project) => project.projectName);
              console.log(`my projects are: ${projectnames}`);
              res.render('mainForm', { username, projectnames });
            } else {
              console.error('Error retrieving user projects:', response.status);
              res.send('Error retrieving user projects');
            }
          } catch (error) {
            console.error('Error retrieving user projects:', error);
            res.send('Error retrieving user projects');
          }
        } else {
          res.render('sorry0'); // Password is incorrect
        }
      } else {
        res.render('sorry0'); // User is not found in the database
      }
    } else {
      res.send("Not added to the database!");
    }
  },
    createAccount: async (req, res) => {
        if (req.body.email && req.body.username &&
             req.body.password &&
             req.body.password2 &&
             req.body.password === req.body.password2 &&
             req.body.password.length >= 8
             ) {
            const { email, username, password, password2 } = req.body;
            const user = await User.findOne({ where: { email } });
            
            if (user) {
                res.render('sorry');   // if the user is already in the database
            } else {
            await User.create({ email, username, password });
            res.render('CongratulationsUser', { username });
            }
        } else {
        res.send("Not added to the database!")
      }
    }, forgetPassword: async (req, res) => {
      if (req.body.email) {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      if (user) {
        const password = user.password;
        const username = user.username;
  
        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'meachattd@gmail.com', 
            pass: 'uvuefizmrjtwmbnd', // my app password
          },
        });
        // Define the email content
        const mailOptions = {
            from: 'meachattd@gmail.com',
            to: email,
            subject: 'Password Recovery',
            html: `
              <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Hello, ${username}!</h2>
                <p>You have requested your password for our cost estimation website.</p>
                <p>Your password is: <strong>${password}</strong></p>
                <p>If you did not initiate this password recovery request, please contact our support team immediately.</p>
                <br>
                <p>Thank you!</p>
                <p>The Cost Estimation Team</p>
              </div>
            `,
          };
  
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            res.render('error'); // Render an error page if sending email fails
          } else {
            console.log('Email sent: ' + info.response);
            res.render('success'); // Render a success page after sending the email
          }
        });
      } else {
        res.render('sorry2');  // Render a sorry page if the email address is not in the database
      }
    } else {
        res.send('Email is required');
        }
  },
};