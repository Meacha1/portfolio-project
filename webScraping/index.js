const cron = require('node-cron');
const ExcelJS = require('exceljs');
const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db-config.js');
const MaterialPriceModel = require('../models/materialPrice.js');

// Create a new Sequelize instance
const sequelize = new Sequelize(dbConfig.DATABASE, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.DIALECT
});

// Define the MaterialPrice model
const MaterialPrice = MaterialPriceModel(sequelize, Sequelize);

// Function to insert or update data using Sequelize
async function insertOrUpdateData(item, price) {
  try {
    const [result] = await MaterialPrice.findOrCreate({
      where: { item },
      defaults: { price }
    });

    if (result) {
      console.log('Data inserted or updated successfully');
    } else {
      console.log('Data not inserted or updated');
    }
  } catch (error) {
    console.error('Error inserting or updating data:', error);
  }
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

        // Parse the price as an integer
        const priceValue = parseInt(price);

        // Check if the values are valid
        if (item && !isNaN(priceValue)) {
          // Insert or update the data using Sequelize
          insertOrUpdateData(item, priceValue);
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
cron.schedule('0 8 * * *', () => {
  console.log('Running the Excel reading function...');
  readDataFromExcel();
});

// Synchronize the Sequelize model with the database
sequelize.sync()
  .then(() => {
    console.log('Sequelize synchronized with the database.');
  })
  .catch((error) => {
    console.error('Error synchronizing Sequelize with the database:', error);
  });

module.exports = readDataFromExcel;
