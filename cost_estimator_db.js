const { Pool } = require('pg');
const dbConfig = require('./config/db-config.js');

const pool = new Pool({
  user: dbConfig.USER,
  host: dbConfig.HOST,
  database: 'postgres', // Default database to connect for creating the specified database
  password: dbConfig.PASSWORD,
  port: dbConfig.PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL server:', err);
    return;
  }
  console.log('Connected to PostgreSQL server');

  // Check if the database exists
  client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbConfig.DATABASE}'`, (err, result) => {
    if (err) {
      console.error('Error checking PostgreSQL database:', err);
      release(); // Release the client back to the pool
      pool.end(); // End the pool connection
      return;
    }

    if (result.rows.length === 0) {
      // Database does not exist, create it
      client.query(`CREATE DATABASE ${dbConfig.DATABASE}`, (err, result) => {
        if (err) {
          console.error('Error creating PostgreSQL database:', err);
        } else {
          console.log('PostgreSQL database created successfully');
        }
        release(); // Release the client back to the pool
        pool.end(); // End the pool connection
      });
    } else {
      // Database already exists
      console.log('PostgreSQL database already exists');
      release(); // Release the client back to the pool
      pool.end(); // End the pool connection
    }
  });
});
