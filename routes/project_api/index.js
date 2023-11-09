const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dbConfig = require("../../config/db-config.js");

const app2 = express();

app2.use(cors()); // Enable CORS for all routes

// Create a MySQL pool
const pool = new Pool({
  user: dbConfig.USER,
  host: dbConfig.HOST,
  database: dbConfig.DATABASE,
  password: dbConfig.PASSWORD,
  port: dbConfig.PORT,
});

// Define the materials route
app2.get('/', (req, res) => {
  // Get a connection from the pool
  pool.connect((err, client, done) => {
    if (err) {
      console.error('Error connecting to PostgreSQL database:', err);
      return res.status(500).send('Error connecting to PostgreSQL database');
    }

    // Define the SQL query
    pool.query('SELECT * FROM project', (error, results) => {
      done(); // Release the client back to the pool

      if (error) {
        console.error('Error executing PostgreSQL query:', error);
        return res.status(500).send('Error executing PostgreSQL query');
      }

      // Send the results back as JSON
      res.json(results.rows);
    });
  });
});

app2.get('/:userId', (req, res) => {
  const { userId } = req.params;

  pool.query('SELECT * FROM "project" WHERE "userId" = $1', [userId], (error, results) => {
    if (error) {
      console.error('Error executing PostgreSQL query:', error);
      return res.status(500).send('Error executing PostgreSQL query');
    }

    // Send the results back as JSON
    res.json(results.rows);
  });
});


app2.get('/api/:projectName', (req, res) => {
  // Get a connection from the pool
  pool.connect((err, client, done) => {
    if (err) {
      console.error('Error connecting to PostgreSQL database:', err);
      return res.status(500).send('Error connecting to PostgreSQL database');
    }

    // Define the SQL query
    const query = 'SELECT * FROM "project" WHERE "projectName" = $1';

    // Execute the query with parameterized query
    client.query(query, [req.params.projectName], (error, result) => {
      done(); // Release the client back to the pool

      if (error) {
        console.error('Error executing PostgreSQL query:', error);
        return res.status(500).send('Error executing PostgreSQL query');
      }

      // Send the results back as JSON
      res.json(result.rows);
    });
  });
});


app2.delete('/:id', (req, res) => {
  // Get a connection from the pool
  pool.connect((err, client, done) => {
    if (err) {
      console.error('Error connecting to PostgreSQL database:', err);
      return res.status(500).send('Error connecting to PostgreSQL database');
    }

    // Define the SQL query
    const query = 'DELETE FROM project WHERE id = $1';

    // Execute the query with parameterized query
    client.query(query, [req.params.id], (error, result) => {
      done(); // Release the client back to the pool

      if (error) {
        console.error('Error executing PostgreSQL query:', error);
        return res.status(500).send('Error executing PostgreSQL query');
      }

      // Check if a row was affected
      if (result.rowCount === 1) {
        // Send success message if a row was deleted
        res.json({ message: 'Project deleted successfully' });
      } else {
        // Send 404 status code if no rows were affected (resource not found)
        res.status(404).json({ message: 'Project not found' });
      }
    });
  });
});


module.exports = app2;