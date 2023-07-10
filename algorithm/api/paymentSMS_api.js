const express = require('express');
const mysql = require('mysql');
const dbConfig = require("../../config/db-config.js");
const e = require('express');

const app3 = express();

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
app3.post('/', (req, res) => {
  const smsData = req.body;
  const { content } = smsData;
  console.log(content);
  const amountMatch = content.match(/ETB ([\d,.]+)/);
  const dateMatch = content.match(/on (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
  const transactionNumberMatch = content.match(/transaction number ([A-Z0-9]+)/);

  if (!amountMatch || !dateMatch || !transactionNumberMatch) {
    console.error('Failed to extract SMS information');
    return res.status(400).send('Invalid SMS format');
  }

  const transaction_amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  const transaction_date = new Date(dateMatch[1]);
  const expiry_date = new Date(transaction_date);


  if (transaction_amount >=5 && transaction_amount <10){ // 5 birr for 7 days
    expiry_date.setDate(expiry_date.getDate() + 7);
  }
  if (transaction_amount >=10 && transaction_amount <20){ // 10 birr for 14 days
    expiry_date.setDate(expiry_date.getDate() + 14);
  }
  if (transaction_amount >=20){                           // 20 birr for 30 days
    expiry_date.setDate(expiry_date.getDate() + 14);
  }

  

  const transaction_number = transactionNumberMatch[1];

  const smsRecord = {
    message: content,
    transaction_amount,
    transaction_date,
    expiry_date,
    transaction_number,
  };

  pool.query('INSERT INTO payment SET ?', smsRecord, (error, results) => {
    if (error) {
      console.error('Failed to store SMS:', error);
      return res.status(500).send('Failed to store SMS');
    }

    console.log('SMS stored successfully');
    res.status(200).send('SMS received and stored successfully');
  });
});


module.exports = app3;
