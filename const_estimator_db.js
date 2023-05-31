const mysql = require('mysql');

const setupDatabase = () => {
  const connection = mysql.createConnection({
    host: 'localhost', // MySQL server host
    port: 3306, // MySQL server port
    user: 'root', // MySQL username
    password: 'password', // MySQL password
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL server:', err);
      return;
    }
    console.log('Connected to MySQL server');

    // Create the database
    connection.query('CREATE DATABASE IF NOT EXISTS const_estimator_db', (err) => {
      if (err) {
        console.error('Error creating MySQL database:', err);
        return;
      }
      console.log('MySQL database created');
    });

    connection.end();
  });
};

module.exports = setupDatabase;
