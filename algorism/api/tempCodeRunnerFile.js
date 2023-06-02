const express = require('express');
const mysql = require('mysql');
const dbConfig = require("../../config/db-config.js");

const app = express();
const port = 3000;

// Create a MySQL pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DATABASE
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
    const query = 'SELECT * FROM material';

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

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});