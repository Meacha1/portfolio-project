const express = require('express');
const mysql = require('mysql');
const dbConfig = require("../../config/db-config.js");

const app3 = express();
const port = 4002;

// Add middleware to parse JSON request body
app3.use(express.json());

// Create a MySQL pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DATABASE
});

// Handle SMS forwarding endpoint
app3.post('/api/receive-sms', (req, res) => {
  const smsData = req.body; // Assuming the SMS data is sent in the request body

  // Process the SMS data as needed
  console.log('Received SMS:', smsData);

  // I can store the SMS data in the database or perform any other operations here

  res.status(200).send('SMS received successfully');
});

app3.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = app3;
