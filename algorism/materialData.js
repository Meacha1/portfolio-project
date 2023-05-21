async function fetchDataFromDatabase(apiUrl) {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

// Define a function to fetch materials data from the database
async function fetchMaterialsDataFromDatabase() {
  const apiUrl = 'http://localhost:4003/api/materials';
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
    const tilePrice = materialsData.find((item) => item.item === 'tile').price;
    
    return { sandPrice, aggregatePrice, cementPrice, steelPrice, HCBPrice, paintPrice, tilePrice };
  })
  .catch(error => {
    console.error('Error fetching data from database:', error);
  });

module.exports = {
  fetchDataFromDatabase,
  fetchMaterialsDataFromDatabase,
  materialsPromise
};
