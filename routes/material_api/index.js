const express = require('express');
const { Pool } = require('pg');
const dbConfig = require('../../config/db-config.js');

const app1 = express();

// Add middleware to parse JSON request body
app1.use(express.json());

// Create a PostgreSQL pool
const pool = new Pool({
  user: dbConfig.USER,
  host: dbConfig.HOST,
  database: dbConfig.DATABASE,
  password: dbConfig.PASSWORD,
  port: dbConfig.PORT,
});

// Define the materials route
app1.get('/', (req, res) => {
  // Get a connection from the pool
  pool.connect((err, client, done) => {
    if (err) {
      console.error('Error connecting to PostgreSQL database:', err);
      return res.status(500).send('Error connecting to PostgreSQL database');
    }

    // Define the SQL query
    pool.query('SELECT * FROM "materialPrice"', (error, results) => {
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

// Add a route for creating a new material
app1.post('/', (req, res) => {
  // Extract the material data from the request body
  const { item, price } = req.body;

  // Define the SQL query to insert a new material
  const query = 'INSERT INTO materialprice (item, price) VALUES ($1, $2)';

  // Execute the query with the material data
  pool.query(query, [item, price], (error, result) => {
    if (error) {
      console.error('Error executing PostgreSQL query:', error);
      return res.status(500).send('Error executing PostgreSQL query');
    }
    // Send a success response
    res.status(201).send('Material created successfully');
  });
});

// Add a route for updating a material
app1.put('/:id', (req, res) => {
  // Extract the material ID from the request parameters
  const { id } = req.params;
  // Extract the material data from the request body
  const { item, price } = req.body;

  // Define the SQL query to update the material
  const query = 'UPDATE materialprice SET item = $1, price = $2 WHERE id = $3';

  // Execute the query with the material data and ID
  pool.query(query, [item, price, id], (error, result) => {
    if (error) {
      console.error('Error executing PostgreSQL query:', error);
      return res.status(500).send('Error executing PostgreSQL query');
    }
    // Send a success response
    res.send('Material updated successfully');
  });
});

// Add a route for deleting a material
app1.delete('/:id', (req, res) => {
  // Extract the material ID from the request parameters
  const { id } = req.params;

  // Define the SQL query to delete the material
  const query = 'DELETE FROM materialprice WHERE id = $1';

  // Execute the query with the material ID
  pool.query(query, [id], (error, result) => {
    if (error) {
      console.error('Error executing PostgreSQL query:', error);
      return res.status(500).send('Error executing PostgreSQL query');
    }
    // Send a success response
    res.send('Material deleted successfully');
  });
});

module.exports = app1;
