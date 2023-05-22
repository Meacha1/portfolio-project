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
const calculateTotalMaterialCost = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      const prices = await materialsPromise;

      // Set the material prices
      const { sandPrice, aggregatePrice, cementPrice, steelPrice, HCBPrice, paintPrice, tilePrice } = prices;
      setMaterialPrices(sandPrice, aggregatePrice, cementPrice, steelPrice, HCBPrice, paintPrice, tilePrice);

      // importing the body of the request
      const numberOfFloors = reqBody.aboveGroundFloor;

      // applying the logic for number of floors
      if (numberOfFloors <= 0) {
        cement = cement * 0.8;
        sand = sand * 0.8;
        aggregate = aggregate * 0.8;
        steel = steel * 0.5; 
      }

      if (numberOfFloors > 4 && numberOfFloors <= 8) {
      cement = cement + (0.01 * (numberOfFloors - 4));
      sand = sand + (0.02 * (numberOfFloors - 4));
      aggregate = aggregate + (0.03 * (numberOfFloors - 4));
      steel = steel + (1.1075 * (numberOfFloors - 4));
      };

      if (numberOfFloors > 8 && numberOfFloors <= 12) {
      cement = cement + (0.02 * (numberOfFloors - 8));
      sand = sand + (0.04 * (numberOfFloors - 8));
      aggregate = aggregate + (0.06 * (numberOfFloors - 8));
      steel = steel + (2.215 * (numberOfFloors - 8));
      };

      if (numberOfFloors > 12 && numberOfFloors <= 16) {
      cement = cement + (0.03 * (numberOfFloors - 12));
      sand = sand + (0.06 * (numberOfFloors - 12));
      aggregate = aggregate + (0.09 * (numberOfFloors - 12));
      steel = steel + (3.3225 * (numberOfFloors - 12));
      };

      if (numberOfFloors > 16 && numberOfFloors <= 20) {
      cement = cement + (0.04 * (numberOfFloors - 16));
      sand = sand + (0.08 * (numberOfFloors - 16));
      aggregate = aggregate + (0.12 * (numberOfFloors - 16));
      steel = steel + (4.43 * (numberOfFloors - 16));
      };

      if (numberOfFloors > 20 && numberOfFloors <= 24) {
      cement = cement + (0.05 * (numberOfFloors - 20));
      sand = sand + (0.1 * (numberOfFloors - 20));
      aggregate = aggregate + (0.15 * (numberOfFloors - 20));
      steel = steel + (5.5375 * (numberOfFloors - 20));
      };

      if (numberOfFloors > 24 && numberOfFloors <= 28) {
      cement = cement + (0.06 * (numberOfFloors - 24));
      sand = sand + (0.12 * (numberOfFloors - 24));
      aggregate = aggregate + (0.18 * (numberOfFloors - 24));
      steel = steel + (6.645 * (numberOfFloors - 24));
      };

      
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

module.exports = { calculateTotalMaterialCost };