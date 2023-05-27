const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 4003;

// Create a MySQL pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'const_estimator_db'
});

// Define the materials route
app.get('/api/materials', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return res.status(500).send('Error connecting to MySQL database');
    }

    // Define the SQL query
    const query = 'SELECT * FROM materialprice';

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

module.exports = app;