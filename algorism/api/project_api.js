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

app2.delete('/api/project/:id', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return res.status(500).send('Error connecting to MySQL database');
    }
    connection.query('DELETE FROM project WHERE id = ?', [req.params.id], (error, results) => {
      // Release the connection back to the pool
      connection.release();
      if (error) {
        console.error('Error executing MySQL query:', error);
        return res.status(500).send('Error executing MySQL query');
      }
      // Send the success message back as JSON
      res.json({ message: 'Project deleted successfully' });
    });
  });
});

module.exports = app2;