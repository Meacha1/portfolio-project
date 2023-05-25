const { models: { User } } = require('../models');

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
                res.send("Wrong password!")
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
},
displyProject: async (req, res) => {

            try {
                const response = await fetch(`http://localhost:4004/api/projects/${ projectName }`);
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
        }
};