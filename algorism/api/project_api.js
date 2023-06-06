const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const dbConfig = require("../../config/db-config.js");

const app2 = express();
const port2 = 4004;

app2.use(cors()); // Enable CORS for all routes

// Create a MySQL pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: dbConfig.HOST,
  user: dbConfig.USER,
  port: dbConfig.PORT,
  password: dbConfig.PASSWORD,
  database: dbConfig.DATABASE
});

// Define the materials route
app2.get('/api/projects', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return res.status(500).send('Error connecting to MySQL database');
    }

    // Define the SQL query
    const query = 'SELECT * FROM project';

    // Execute the query
    connection.query(query, (error, results) => {
      // Release the connection back to the pool
      connection.release();

      if (error) {
        console.error('Error executing MySQL query:', error);
        return res.status(500).send('Error executing MySQL query');
      }

      // Send the results back as JSON
      res.json(results);
    });
  });
});

app2.get('/api/projects/:userId', (req, res) => {
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
        console.error('Error connecting to MySQL database:', err);
        return res.status(500).send('Error connecting to MySQL database');
        }
        connection.query('SELECT * FROM project WHERE userId = ?', [req.params.userId], (error, results) => {
            // Release the connection back to the pool
            connection.release();
            if (error) {
                console.error('Error executing MySQL query:', error);
                return res.status(500).send('Error executing MySQL query');
            }
            // Send the results back as JSON
            res.json(results);
        });
    });
});

app2.get('/api/project/:projectName', (req, res) => {
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
      if (err) {
      console.error('Error connecting to MySQL database:', err);
      return res.status(500).send('Error connecting to MySQL database');
      }
      connection.query('SELECT * FROM project WHERE projectName = ?', [req.params.projectName], (error, results) => {
          // Release the connection back to the pool
          connection.release();
          if (error) {
              console.error('Error executing MySQL query:', error);
              return res.status(500).send('Error executing MySQL query');
          }
          // Send the results back as JSON
          res.json(results);
      });
  });
});

app2.put('/api/project/:projectName', (req, res) => {
  const {
    builtUpArea,
    aboveGroundFloor,
    belowGroundFloor,
    floorFinishingType,
    carpentryAndJoinery,
    roofingMaterial,
    HVACSystem,
    fireProtectionSystem,
    buildingType,
    sanitaryFixtures,
    electricalMaterial,
    costEstimate,
    updatedAt
  } = req.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return res.status(500).send('Error connecting to MySQL database');
    }

    const projectName = req.params.projectName;

    // Define the SQL query
    const query = `
      UPDATE project
      SET builtUpArea = ?, aboveGroundFloor = ?, belowGroundFloor = ?, floorFinishingType = ?,
          carpentryAndJoinery = ?, roofingMaterial = ?, HVACSystem = ?, fireProtectionSystem = ?,
          buildingType = ?, sanitaryFixtures = ?, electricalMaterial = ?, costEstimate = ?, updatedAt = ?
      WHERE projectName = ?
    `;

    // Execute the query
    connection.query(
      query,
      [
        builtUpArea,
        aboveGroundFloor,
        belowGroundFloor,
        floorFinishingType,
        carpentryAndJoinery,
        roofingMaterial,
        HVACSystem,
        fireProtectionSystem,
        buildingType,
        sanitaryFixtures,
        electricalMaterial,
        costEstimate,
        updatedAt,
        projectName
      ],
      (error, results) => {
        // Release the connection back to the pool
        connection.release();
        if (error) {
          console.error('Error executing MySQL query:', error);
          return res.status(500).send('Error executing MySQL query');
        }
        // Send the results back as JSON
        res.json(results);
      }
    );
  });
});


module.exports = app2;