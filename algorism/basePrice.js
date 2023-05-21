const { setMaterialPrices } = require('./materialPrices');
const { materialsPromise } = require('./materialData');
const { getMaterialPrices } = require('./materialPrices');

// Material usage per meter square
var cement = 2.1527; // quntal = 100 kg
var sand = 0.5376; // meter cube
var aggregate = 0.41096; // meter cube
var steel = 43.01075; // kg
var HCB = 17.3; // no
var paint = 0.183; // liter
var tile = 1.3; // meter square

// Percentage of material usage
var percentage = {
  cement: 16,
  sand: 12,
  aggregate: 7.5,
  steel: 24,
  HCB: 4.5,
  paint: 4,
  tile: 8
};

// Sum of percentages
var percentageSum = Object.values(percentage).reduce((a, b) => a + b, 0);
var remainingPercent = 100 - percentageSum;

// Material cost per meter square
const calculateTotalMaterialCost = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const prices = await materialsPromise;

      // Set the material prices
      const { sandPrice, aggregatePrice, cementPrice, steelPrice, HCBPrice, paintPrice, tilePrice } = prices;
      setMaterialPrices(sandPrice, aggregatePrice, cementPrice, steelPrice, HCBPrice, paintPrice, tilePrice);

      var materialCost = {
        cement: cement * getMaterialPrices().cementPrice,
        sand: sand * getMaterialPrices().sandPrice,
        aggregate: aggregate * getMaterialPrices().aggregatePrice,
        steel: steel * getMaterialPrices().steelPrice,
        HCB: HCB * getMaterialPrices().HCBPrice,
        paint: paint * getMaterialPrices().paintPrice,
        tile: tile * getMaterialPrices().tilePrice
      };

      var materialCostSum = Object.values(materialCost).reduce((a, b) => a + b, 0);
      var remainingMaterialCost = materialCostSum * (remainingPercent / percentageSum);
      var totalmaterialCost = materialCostSum + remainingMaterialCost;


      resolve(totalmaterialCost);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  calculateTotalMaterialCost
};