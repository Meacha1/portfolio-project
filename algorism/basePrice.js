const { getMaterialPrices } = require('./materialPrices');
const { setMaterialPrices } = require('./materialPrices');
const { materialsPromise } = require('./api/material_api');
const { fetchDataFromDatabase } = require('./materialData');


//material usage per meter square

var cement = 2.1527;  //quntal = 100 kg
var sand = 0.5376;  //meter cube
var aggregate = 0.41096;  //meter cube
var steel = 43.01075;  //kg
var HCB = 0.0;  //no
var paint = 0.183;  //liter
var tile = 0.0;  //meter square

//percentage of material usage

var percentage = {
    cement: 16,
    sand: 12,
    aggregate: 7.5,
    steel: 24,
    HCB: 4.5,
    paint: 4,
    tile: 8
};

// sum of percentage
var percentageSum = 0;
for (var i in percentage) {
    percentageSum += percentage[i];
}
var reamingpercent = 100 - percentageSum;
//material cost per meter square

materialsPromise
  .then(prices => {
    // Set the material prices
    const { sandPrice, aggregatePrice, cementPrice } = prices;
    setMaterialPrices(sandPrice, aggregatePrice, cementPrice);
    
    // Usage example
    const retrievedPrices = getMaterialPrices();
    console.log(retrievedPrices.sandPrice);
    console.log(retrievedPrices.aggregatePrice);
    console.log(retrievedPrices.cementPrice);
  })
  .catch(error => {
    console.error('Error fetching material prices:', error);
  });