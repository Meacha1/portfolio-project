const express = require('express');
const { Pool } = require('pg');
const dbConfig = require('../../config/db-config.js');

const app3 = express();

// Add middleware to parse JSON request body
app3.use(express.json());

// Create a MySQL pool
const pool = new Pool({
  user: dbConfig.USER,
  host: dbConfig.HOST,
  database: dbConfig.DATABASE,
  password: dbConfig.PASSWORD,
  port: dbConfig.PORT,
});

// Handle SMS forwarding endpoint
app3.post('/', (req, res) => {
  const smsData = req.body;
  const { content } = smsData;
  console.log(content);
  const amountMatch = content.match(/ETB ([\d,.]+)/);
  const dateMatch = content.match(/on (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
  const transactionNumberMatch = content.match(/transaction number ([A-Z0-9]+)/);
  const messageMatch = content.match(/transaction number ([A-Z0-9]+)/);

  if (!amountMatch || !dateMatch || !transactionNumberMatch) {
    console.error('Failed to extract SMS information');
    return res.status(400).send('Invalid SMS format');
  }

  const transaction_amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  const transaction_date = new Date(dateMatch[1]);
  const expiry_date = new Date(transaction_date);
  const transaction_number = transactionNumberMatch[1];
  const message = messageMatch[1];

  if (transaction_amount >=5 && transaction_amount <10){ // 5 birr for 7 days
    expiry_date.setDate(expiry_date.getDate() + 7);
  }
  if (transaction_amount >=10 && transaction_amount <20){ // 10 birr for 14 days
    expiry_date.setDate(expiry_date.getDate() + 14);
  }
  if (transaction_amount >=20){                           // 20 birr for 30 days
    expiry_date.setDate(expiry_date.getDate() + 14);
  }

  const smsRecord = {
    message,
    transaction_amount,
    transaction_date,
    expiry_date,
    transaction_number,
  };

  pool.query('INSERT INTO payment (message, transaction_amount, transaction_date, expiry_date, transaction_number) VALUES ($1, $2, $3, $4, $5)',
    [smsRecord.message, smsRecord.transaction_amount, smsRecord.transaction_date, smsRecord.expiry_date, smsRecord.transaction_number],
    (error, results) => {
      if (error) {
        console.error('Failed to store SMS:', error);
        return res.status(500).send('Failed to store SMS');
      }

      console.log('SMS stored successfully');
      res.status(200).send('SMS received and stored successfully');
    });
});


module.exports = app3;
