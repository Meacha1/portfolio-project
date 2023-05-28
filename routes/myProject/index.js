const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', (req, res) => {
  const projectName = req.query['projectName'];
  console.log(`my project name is: ${projectName}`);
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
});

module.exports = router;