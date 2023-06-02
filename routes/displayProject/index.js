const express = require('express');
const router = express.Router();

const { project } = require('../../controller'); 

router.get('/', (req, res) => {
  const projectName = req.query['projectName'];
  console.log(`my project name is: ${projectName}`);

  // Use dynamic import to import node-fetch
  import('node-fetch')
    .then(({ default: fetch }) => {
      // Make your API call using the projectName variable
      fetch(`http://localhost:4004/api/project/${encodeURIComponent(projectName)}`)
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

router.post('/', (req, res) => {
  const userId = req.session.userId; // Retrieve the userId from the session
  project.updateProject(req, res, userId); // Call the updateProject function and pass the userId
});

module.exports = router;