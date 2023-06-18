const fetch = require('isomorphic-fetch');
const dbConfig = require('../config/db-config.js');

const host = dbConfig.HOST;

async function fetchDataFromDatabase(apiUrl) {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

// Define a function to fetch materials data from the database
async function fetchMaterialsDataFromDatabase() {
  const apiUrl = `http://${host}:4003/api/materials`;
  const materialsData = await fetchDataFromDatabase(apiUrl);
  return materialsData;
}

const materialsPromise = Promise.all([
  fetchMaterialsDataFromDatabase(),
])
  .then(([materialsData]) => {
    const sandPrice = materialsData.find((item) => item.item === 'sand').price;
    const aggregatePrice = materialsData.find((item) => item.item === 'aggregate').price;
    const cementPrice = materialsData.find((item) => item.item === 'cement').price;
    const steelPrice = materialsData.find((item) => item.item === 'steel').price;
    const HCBPrice = materialsData.find((item) => item.item === 'HCB').price;
    const paintPrice = materialsData.find((item) => item.item === 'paint').price;
    const marbleLocalPrice = materialsData.find((item) => item.item === 'marbleLocal').price;
    const graniteLocalPrice = materialsData.find((item) => item.item === 'graniteLocal').price;
    const graniteImportedPrice = materialsData.find((item) => item.item === 'graniteImported').price;
    const ceramicLocalPrice = materialsData.find((item) => item.item === 'ceramicLocal').price;
    const ceramicImportedPrice = materialsData.find((item) => item.item === 'ceramicImported').price;
    const porcelineLocalPrice = materialsData.find((item) => item.item === 'porcelineLocal').price;
    const porcelineImportedPrice = materialsData.find((item) => item.item === 'porcelineImported').price;
    
    return { sandPrice, aggregatePrice, cementPrice, steelPrice, HCBPrice, paintPrice, marbleLocalPrice, graniteLocalPrice, graniteImportedPrice, ceramicLocalPrice, ceramicImportedPrice, porcelineLocalPrice, porcelineImportedPrice  };
  })
  .catch(error => {
    console.error('Error fetching data from database:', error);
  });

module.exports = {
  fetchDataFromDatabase,
  fetchMaterialsDataFromDatabase,
  materialsPromise
};
