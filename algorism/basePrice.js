const { setMaterialPrices } = require('./materialPrices');
const { materialsPromise } = require('./materialData');
const { getMaterialPrices } = require('./materialPrices');


//material usage per meter square

var cement = 2.1527;  //quntal = 100 kg
var sand = 0.5376;  //meter cube
var aggregate = 0.41096;  //meter cube
var steel = 43.01075;  //kg
var HCB = 17.3;  //no
var paint = 0.183;  //liter
var tile = 1.3;  //meter square

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
    const { sandPrice, aggregatePrice, cementPrice, steelPrice, HCBPrice, paintPrice, tilePrice  } = prices;
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
    var otherCost = materialCostSum * (reamingpercent / percentageSum);
    var totalmaterialCost = materialCostSum + otherCost;

    return totalmaterialCost;
  })
  .catch(error => {
    console.error('Error fetching material prices:', error);
  });