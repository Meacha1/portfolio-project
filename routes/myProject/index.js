const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', (req, res) => {
  // Make your API call here
  fetch('http://localhost:4004/api/project/My%20Building%20in%20Summit')
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