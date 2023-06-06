const mysql = require('mysql');
const dbConfig = require('./config/db-config.js');

const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  port: dbConfig.PORT,
  password: dbConfig.PASSWORD,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server:', err);
    return;
  }
  console.log('Connected to MySQL server');

  // Create the database
  connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.DATABASE}`, (err) => {
    if (err) {
      console.error('Error creating MySQL database:', err);
      return;
    }
    console.log('MySQL database created');
    connection.end();
  });
});