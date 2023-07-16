const express = require('express');
const router = express.Router();
const { project } = require('../../controller');
const { models: { User } } = require('../../models');
const dbConfig = require('../../config/db-config.js');
const host = dbConfig.HOST;


router.get('/', (req, res) => {
  const projectName = req.query['projectName'];
  console.log(`my project name is: ${projectName}`);

  // Use dynamic import to import node-fetch
  import('node-fetch')
    .then(({ default: fetch }) => {
      // Make your API call using the projectName variable
      fetch(`http://${host}:3000/projects/api/${encodeURIComponent(projectName)}`)
        .then(response => response.json())
        .then(data => {
          // Render the Pug template and pass the API response data as a variable
          res.render('displayProject', { data: data });
        })
        .catch(error => {
          console.log('Error:', error);
          res.status(500).send('Error retrieving API data');
        });
    })
    .catch(error => {
      console.log('Error:', error);
      res.status(500).send('Error importing node-fetch');
    });
});

router.post('/', async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ where: { id: userId } });
  if (user.isVIP) {
    project.updateProject(req, res, userId); // Update the project in the database
  } else {
    res.redirect('vip'); // Redirect to the VIP page
  }
});

module.exports = router;