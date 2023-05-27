const puppeteer = require('puppeteer');
const cron = require('node-cron');
const mysql = require('mysql');

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'price_list'
});

// Function to insert data into MySQL
function insertDataToMySQL(item, price) {
  const query = `UPDATE material SET price = ${price} WHERE item = '${item}'`;
  connection.query(query, (error, results, fields) => {
    if (error) throw error;
    console.log('Data inserted successfully');
  });
}

async function scrapeMercato() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // set the navigation timeout to 0 (i.e., infinite)
  page.setDefaultNavigationTimeout(0);
  await page.goto('https://con.2merkato.com/prices/cat/2');

  const [el] = await page.$x('//*[@id="content"]/main/div/div/div[2]/table/tbody/tr[2]/td[2]/text()');
  const txt = await el.getProperty('textContent');
  const srcTxt = await txt.jsonValue();

  // Remove new lines and unnecessary spaces
  const cleanText = srcTxt.replace(/\n/g, '').trim();

  // Convert cleaned text to a float without losing decimal precision
  const price = parseFloat(cleanText.replace(',', ''));

  // Insert the data into MySQL
  insertDataToMySQL('cement', price);

  await browser.close();
}

// Schedule the scraping function to run once a day at a specific time (e.g., 8:00 AM)
cron.schedule('*/60 * * * * *', () => {
    console.log('Running the scraping function...');
    scrapeMercato();
  });
