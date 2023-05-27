const cron = require('node-cron');
const mysql = require('mysql');
const ExcelJS = require('exceljs');

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'const_estimator_db'
});

// Function to insert data into MySQL
function insertDataToMySQL(item, price) {
  const selectQuery = `SELECT * FROM materialprice WHERE item = '${item}'`;
  connection.query(selectQuery, (error, results, fields) => {
    if (error) throw error;

    // Check if the item exists in the database
    if (results.length > 0) {
      // Item exists, perform update
      const updateQuery = `UPDATE materialprice SET price = ${price} WHERE item = '${item}'`;
      connection.query(updateQuery, (error, results, fields) => {
        if (error) throw error;
        console.log('Data updated successfully');
      });
    } else {
      // Item doesn't exist, perform insert
      const insertQuery = `INSERT INTO materialprice (item, price) VALUES ('${item}', ${price})`;
      connection.query(insertQuery, (error, results, fields) => {
        if (error) throw error;
        console.log('Data inserted successfully');
      });
    }
  });
}


// Function to read data from Excel file
async function readDataFromExcel() {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('./webScraping/material.xlsx');

    const worksheet = workbook.getWorksheet('Sheet1');
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const item = row.getCell(1).value;
        const priceCell = row.getCell(2);
    
        // Retrieve the value as a string
        const price = priceCell.text;
    
        console.log(`Row ${rowNumber}: item=${item}, price=${price}`);
    
        // Parse the price as a float
        const priceValue = parseFloat(price);
    
        // Check if the values are valid
        if (item && !isNaN(priceValue)) {
          // Insert the data into MySQL
          insertDataToMySQL(item, priceValue);
        } else {
          console.warn(`Skipping invalid row in Excel: Row ${rowNumber}`);
        }
      }
    });

    console.log('Data reading from Excel completed.');
  } catch (error) {
    console.error('Error reading Excel file:', error);
  }
}

// Schedule the Excel reading function to run once a day at a specific time (e.g., 8:00 AM)
cron.schedule('*/10 * * * * *', () => {
  console.log('Running the Excel reading function...');
  readDataFromExcel();
});
