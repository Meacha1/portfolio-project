const cron = require('node-cron');
const puppeteer = require('puppeteer');
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
async function insertDataToMySQL(item, price) {
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

async function scrapeMercato() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto('https://con.2merkato.com/prices/cat/2', { timeout: 0 });
  const productsHandles = await page.$$('div > div.col-md-9 > table > tbody > tr');

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  var cement = 0;
  var cementCount = 0;
  var sand = 0;
  var sandCount = 0;
  var agregates = 0;
  var agregatesCount = 0;
  var steel = 0;
  var steelCount = 0;

  for (const producthandle of productsHandles) {
    const itemName = await page.evaluate((el) => el.querySelector('td:nth-child(1) > a').textContent, producthandle);
    const itemPrice = await page.evaluate((el) => el.querySelector('td:nth-child(2)').textContent, producthandle);
    const lastUpdate = await page.evaluate((el) => el.querySelector('td:nth-child(5)').textContent, producthandle);

    const lastUpdateDate = new Date(lastUpdate);

    if (lastUpdateDate >= twoMonthsAgo) {
      if (itemName.includes('Cement')) {
        cement += parseFloat(itemPrice.trim().replace(',', ''));
        cementCount++;
      }
      if (itemName.includes('Sand')) {
        sand += parseFloat(itemPrice.trim().replace(',', ''));
        sandCount++;
      }
      if (itemName.includes('Gravel')) {
        agregates += parseFloat(itemPrice.trim().replace(',', ''));
        agregatesCount++;
      }
      if (itemName.includes('Reinforcement') && itemName.includes('Ethiopia') && !itemName.includes('6mm')) {
        steel += parseFloat(itemPrice.trim().replace(',', ''));
        steelCount++;
      }
    }
  }
  console.log('Average Price of cement', cement / cementCount);
  insertDataToMySQL('cement', cement / cementCount);
  console.log('Average Price of sand', sand / sandCount);
  insertDataToMySQL('sand', sand / sandCount);
  console.log('Average Price of agregates', agregates / agregatesCount);
  insertDataToMySQL('aggregate', agregates / agregatesCount);
  console.log('Average Price of steel', steel / steelCount);
  insertDataToMySQL('steel', steel / steelCount);

  // Scrape data from another page
  await page.goto('https://con.2merkato.com/prices/cat/4', { timeout: 0 });

  var HCB = 0;
  var HCBCount = 0;

  const productsHandles2 = await page.$$('div > div.col-md-9 > table > tbody > tr');
  for (const producthandle of productsHandles2) {
    const itemName = await page.evaluate((el) => el.querySelector('td:nth-child(1) > a').textContent, producthandle);
    const itemPrice = await page.evaluate((el) => el.querySelector('td:nth-child(2)').textContent, producthandle);
    const lastUpdate = await page.evaluate((el) => el.querySelector('td:nth-child(5)').textContent, producthandle);

    const lastUpdateDate = new Date(lastUpdate);

    if (lastUpdateDate >= twoMonthsAgo) {
      if (itemName.includes('HCB')  && itemName.includes('15cm')) {
        HCB += parseFloat(itemPrice.trim().replace(',', ''));
        HCBCount++;
      }
    }
  }
  console.log('Average Price of HCB', HCB / HCBCount);
  insertDataToMySQL('HCB', HCB / HCBCount);

  // Scrape data from another page
  await page.goto('https://con.2merkato.com/prices/cat/8', { timeout: 0 });

  var graniteLocal = 0;
  var graniteLocalCount = 0;
  var graniteImported = 0;
  var graniteImportedCount = 0;
  var marbleLocal = 0;
  var marbleLocalCount = 0;
  var ceramicLocal = 0;
  var ceramicLocalCount = 0;
  var porcelineLocal = 0;
  var porcelineLocalCount = 0;

  const productsHandles3 = await page.$$('div > div.col-md-9 > table > tbody > tr');
  for (const producthandle of productsHandles3) {
    const itemName = await page.evaluate((el) => el.querySelector('td:nth-child(1) > a').textContent, producthandle);
    const itemPrice = await page.evaluate((el) => el.querySelector('td:nth-child(2)').textContent, producthandle);
    const lastUpdate = await page.evaluate((el) => el.querySelector('td:nth-child(5)').textContent, producthandle);

    const lastUpdateDate = new Date(lastUpdate);

    if (lastUpdateDate >= twoMonthsAgo) {
      if (itemName.includes('Granite') && itemName.includes('2cm') && itemName.includes('Ethiopia')) {
        graniteLocal += parseFloat(itemPrice.trim().replace(',', ''));
        graniteLocalCount++;
      }
      if (itemName.includes('Granite') && itemName.includes('2cm') && itemName.includes('Imported')) {
        graniteImported += parseFloat(itemPrice.trim().replace(',', ''));
        graniteImportedCount++;
      }
      if (itemName.includes('Marble') && itemName.includes('2cm')) {
        marbleLocal += parseFloat(itemPrice.trim().replace(',', ''));
        marbleLocalCount++;
      }
      if (itemName.includes('Ceramic') && itemName.includes('60cm x 60cm')) {
        ceramicLocal += parseFloat(itemPrice.trim().replace(',', ''));
        ceramicLocalCount++;
      }
      if (itemName.includes('Porceline') && itemName.includes('40cm x 40cm')) {
        porcelineLocal += parseFloat(itemPrice.trim().replace(',', ''));
        porcelineLocalCount++;
      }
    }
  }

  console.log('Average Price of graniteLocal', graniteLocal / graniteLocalCount);
  insertDataToMySQL('graniteLocal', graniteLocal / graniteLocalCount);
  console.log('Average Price of graniteImported', graniteImported / graniteImportedCount);
  insertDataToMySQL('graniteImported', graniteImported / graniteImportedCount);
  console.log('Average Price of marbleLocal', marbleLocal / marbleLocalCount);
  insertDataToMySQL('marbleLocal', marbleLocal / marbleLocalCount);
  console.log('Average Price of ceramic', ceramicLocal / ceramicLocalCount);
  insertDataToMySQL('ceramicLocal', ceramicLocal / ceramicLocalCount);
  insertDataToMySQL('ceramicImported', (ceramicLocal / ceramicLocalCount) * 1.5);
  console.log('Average Price of porceline', porcelineLocal / porcelineLocalCount);
  insertDataToMySQL('porcelineLocal', porcelineLocal / porcelineLocalCount);
  insertDataToMySQL('porcelineImported', (porcelineLocal / porcelineLocalCount) * 1.5);

  // Scrape data from another page
  await page.goto('https://con.2merkato.com/prices/cat/10', { timeout: 0 });

  var paint = 0;
  var paintCount = 0;

  const productsHandles4 = await page.$$('div > div.col-md-9 > table > tbody > tr');
  for (const producthandle of productsHandles4) {
    const itemName = await page.evaluate((el) => el.querySelector('td:nth-child(1) > a').textContent, producthandle);
    const itemPrice = await page.evaluate((el) => el.querySelector('td:nth-child(2)').textContent, producthandle);
    const lastUpdate = await page.evaluate((el) => el.querySelector('td:nth-child(5)').textContent, producthandle);

    const lastUpdateDate = new Date(lastUpdate);

    if (lastUpdateDate >= twoMonthsAgo) {
      if (itemName.includes('Plastic Paint')) {
        paint += parseFloat(itemPrice.trim().replace(',', ''));
        paintCount++;
      }
    }
  }
  console.log('Average Price of paint', (paint / paintCount) / 3.78);
  insertDataToMySQL('paint', (paint / paintCount) / 3.78);

  await browser.close();
}

// // Schedule the scraping function to run once a day at a specific time (e.g., 8:00 AM)
// cron.schedule('*/60 * * * * *', () => {
//   console.log('Running the scraping function...');
//   scrapeMercato();
// });

// Schedule the Excel reading function to run once a day at a specific time (e.g., 8:00 AM)
cron.schedule('0 8 * * *', () => {
  console.log('Running the Excel reading function...');
  scrapeMercato();
});

// Synchronize the Sequelize model with the database
sequelize.sync()
  .then(() => {
    console.log('Sequelize synchronized with the database.');
  })
  .catch((error) => {
    console.error('Error synchronizing Sequelize with the database:', error);
  });

module.exports = scrapeMercato;
