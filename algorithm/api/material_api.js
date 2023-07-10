const express = require('express');
const mysql = require('mysql');
const dbConfig = require("../../config/db-config.js");

const app1 = express();

// Add middleware to parse JSON request body
app1.use(express.json());

// Create a MySQL pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DATABASE
});

// Define the materials route
app1.get('/api/materials', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return res.status(500).send('Error connecting to MySQL database');
    }
    // Define the SQL query
    const query = 'SELECT * FROM materialPrice';
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

// Add a route for creating a new material
app1.post('/api/materials', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return res.status(500).send('Error connecting to MySQL database');
    }
    // Extract the material data from the request body
    const { item, price } = req.body;
    // Define the SQL query to insert a new material
    const query = 'INSERT INTO materialPrice (item, price) VALUES (?, ?)';
    // Execute the query with the material data
    connection.query(query, [item, price], (error, result) => {
      // Release the connection back to the pool
      connection.release();
      if (error) {
        console.error('Error executing MySQL query:', error);
        return res.status(500).send('Error executing MySQL query');
      }
      // Send a success response
      res.status(201).send('Material created successfully');
    });
  });
});

// Add a route for updating a material
app1.put('/api/materials/:id', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return res.status(500).send('Error connecting to MySQL database');
    }
    // Extract the material ID from the request parameters
    const { id } = req.params;
    // Extract the material data from the request body
    const { item, price } = req.body;
    // Define the SQL query to update the material
    const query = 'UPDATE materialPrice SET item = ?, price = ? WHERE id = ?';
    // Execute the query with the material data and ID
    connection.query(query, [item, price, id], (error, result) => {
      // Release the connection back to the pool
      connection.release();
      if (error) {
        console.error('Error executing MySQL query:', error);
        return res.status(500).send('Error executing MySQL query');
      }
      // Send a success response
      res.send('Material updated successfully');
    });
  });
});

// Add a route for deleting a material
app1.delete('/api/materials/:id', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return res.status(500).send('Error connecting to MySQL database');
    }
    // Extract the material ID from the request parameters
    const { id } = req.params;
    // Define the SQL query to delete the material
    const query = 'DELETE FROM materialPrice WHERE id = ?';
    // Execute the query with the material ID
    connection.query(query, [id], (error, result) => {
      // Release the connection back to the pool
      connection.release();
      if (error) {
        console.error('Error executing MySQL query:', error);
        return res.status(500).send('Error executing MySQL query');
      }
      // Send a success response
      res.send('Material deleted successfully');
    });
  });
});

module.exports = app1;