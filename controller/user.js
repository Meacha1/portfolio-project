const { models: { User } } = require('../models');
const nodemailer = require('nodemailer');

module.exports = {
    login: async (req, res) => {
        if (req.body.email && req.body.password) {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email, password } });
            if (user) {
                req.session.userId = user.id; // Store userId in the session
                const username = user.username;
                console.log(`my user id is: ${user.id}`);

                // Fetch projects from the database
                try {
                    const response = await fetch(`http://localhost:4004/api/projects/${user.id}`);
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
                res.render('sorry0');
            }
        } else {
            res.send("Not added to the database!")
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
            const user = await User.findOne({ where: { email, username } });
            
            if (user) {
                res.render('sorry');
            } else {
            await User.create({ email, username, password });
            res.render('congratulationsUser', { username });
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
          service: 'Gmail', // Specify your email service provider (e.g., Gmail, Yahoo)
          auth: {
            user: 'meachattd@gmail.com', // Enter your email address
            pass: 'uvuefizmrjtwmbnd', // Enter your email password or app password
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

// displyProject: async (req, res) => {

//             try {
//                 const response = await fetch(`http://localhost:4004/api/projects/${ projectName }`);
//                 if (response.ok) {
//                   const projects = await response.json();
//                   const projectnames = projects.map((project) => project.projectName);
//                   console.log(`my projects are: ${projectnames}`);
//                   res.render('mainForm', { username, projectnames });
//                 } else {
//                   console.error('Error retrieving user projects:', response.status);
//                   res.send('Error retrieving user projects');
//                 }
//               } catch (error) {
//                 console.error('Error retrieving user projects:', error);
//                 res.send('Error retrieving user projects');
//               }
//         }
};