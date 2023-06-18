const express = require('express');
const router = express.Router();
const { project } = require('../../controller');
const dbConfig = require('../../config/db-config.js');

const host = dbConfig.HOST;


router.get('/', (req, res) => {
    const userId = req.session.userId; // Retrieve the userId from the session
    const projectName = req.body.projectName; // Retrieve the projectName from the request body
  
    // Call the deleteProject function and pass the userId and projectName
    project.deleteProject(req, res, userId, projectName)
      .catch(error => {
        console.log('Error:', error);
        res.status(500).send('Error deleting project');
      });
  });

module.exports = router;