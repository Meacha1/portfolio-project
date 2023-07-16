const { setMaterialPrices } = require('./materialPrices');
const { materialsPromise } = require('./materialData');
const { getMaterialPrices } = require('./materialPrices');


// percentage other than material

var otherPercentage = 40;   // 40% of total project cost, this includes labor cost, equipment, transportation cost, etc.

// Material cost per meter square
const calculateTotalMaterialCost = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      const prices = await { materialsPromise };
        
      // Material usage per meter square
      var cement = 2.1527; // quntal = 100 kg
      var sand = 0.5376; // meter cube
      var aggregate = 0.41096; // meter cube
      var steel = 41.01075; // kg 43.01075
      var HCB = 17.3; // no 17.3
      var paint = 0.183; // liter
      var tile = 1.3; // meter square

      // Percentage of material usage
      var percentage = {
        cement: 16,
        sand: 12.5,
        aggregate: 7.5,
        steel: 26,
        HCB: 4.5,
        paint: 4,
        tile: 7,
        carpentryAndJoinery: 0,
        HVAC: 0,
        fireprotection: 0,
        sanitaryFixtures: 0,
        electricalMaterial: 0
      };

      var otherPercentage = 40;   // 40% of total project cost, this includes labor cost, equipment, transportation cost, etc.
      // Set the material prices
      const { sandPrice, aggregatePrice, cementPrice, steelPrice, HCBPrice, paintPrice, marbleLocalPrice, graniteLocalPrice, graniteImportedPrice, ceramicLocalPrice, ceramicImportedPrice, porcelineLocalPrice, porcelineImportedPrice } = prices;
      setMaterialPrices(sandPrice, aggregatePrice, cementPrice, steelPrice, HCBPrice, paintPrice, marbleLocalPrice, graniteLocalPrice, graniteImportedPrice, ceramicLocalPrice, ceramicImportedPrice, porcelineLocalPrice, porcelineImportedPrice);

      // importing the body of the request
      const numberOfFloorsAboveGroundFloor = parseInt(reqBody.aboveGroundFloor);
      const numberOfbasement = parseInt(reqBody.belowGroundFloor);
      const numberOfFloors = numberOfFloorsAboveGroundFloor + numberOfbasement;
    

      // applying the logic for number of floors
      if (numberOfFloors == 0) {
        cement = cement * 0.95;
        sand = sand * 0.95;
        aggregate = aggregate * 0.95;
        steel = steel * 0.95;
        otherPercentage = otherPercentage - 2;     
      }

      if (numberOfFloors > 4 && numberOfFloors <= 8) {
      cement = cement + (0.01 * (numberOfFloors - 4));
      sand = sand + (0.02 * (numberOfFloors - 4));
      aggregate = aggregate + (0.03 * (numberOfFloors - 4));
      steel = steel + (1.1075 * (numberOfFloors - 4));
      otherPercentage = otherPercentage + 1.5;
      };

      if (numberOfFloors > 8 && numberOfFloors <= 12) {
      cement = cement + (0.02 * (numberOfFloors - 8));
      sand = sand + (0.04 * (numberOfFloors - 8));
      aggregate = aggregate + (0.06 * (numberOfFloors - 8));
      steel = steel + (2.215 * (numberOfFloors - 8));
      otherPercentage = otherPercentage + 3;
      };

      if (numberOfFloors > 12 && numberOfFloors <= 16) {
      cement = cement + (0.03 * (numberOfFloors - 12));
      sand = sand + (0.06 * (numberOfFloors - 12));
      aggregate = aggregate + (0.09 * (numberOfFloors - 12));
      steel = steel + (3.3225 * (numberOfFloors - 12));
      otherPercentage = otherPercentage + 4.5;
      };

      if (numberOfFloors > 16 && numberOfFloors <= 20) {
      cement = cement + (0.04 * (numberOfFloors - 16));
      sand = sand + (0.08 * (numberOfFloors - 16));
      aggregate = aggregate + (0.12 * (numberOfFloors - 16));
      steel = steel + (4.43 * (numberOfFloors - 16));
      otherPercentage = otherPercentage + 6;
      };

      if (numberOfFloors > 20 && numberOfFloors <= 24) {
      cement = cement + (0.05 * (numberOfFloors - 20));
      sand = sand + (0.1 * (numberOfFloors - 20));
      aggregate = aggregate + (0.15 * (numberOfFloors - 20));
      steel = steel + (5.5375 * (numberOfFloors - 20));
      otherPercentage = otherPercentage + 7.5;
      };

      if (numberOfFloors > 24 && numberOfFloors <= 28) {
      cement = cement + (0.06 * (numberOfFloors - 24));
      sand = sand + (0.12 * (numberOfFloors - 24));
      aggregate = aggregate + (0.18 * (numberOfFloors - 24));
      steel = steel + (6.645 * (numberOfFloors - 24));
      otherPercentage = otherPercentage + 9;
      };

      if (numberOfFloors >= 28) {
        cement = cement + (0.07 * (numberOfFloors - 28));
        sand = sand + (0.14 * (numberOfFloors - 28));
        aggregate = aggregate + (0.21 * (numberOfFloors - 28));
        steel = steel + (7.645 * (numberOfFloors - 28));
        otherPercentage = otherPercentage + 10;
        };

      // applying the logic for floor finish

      const tileType = reqBody.floorFinishingType + "Price";

      console.log('precentage.tile: ', percentage.tile)

      if (reqBody.floorFinishingType == "marbleLocal") {
        percentage.tile = percentage.tile + 10;   // i will chane the hardcoded value by takeking the ratio of materil price to total material price
      }

      if (reqBody.floorFinishingType == "graniteLocal") {
        percentage.tile = percentage.tile + 9;
      };

      if (reqBody.floorFinishingType == "graniteImported") {
        percentage.tile = percentage.tile + 9.5;
      };

      if (reqBody.floorFinishingType == "ceramicLocal") {
        percentage.tile = percentage.tile;
      };

      if (reqBody.floorFinishingType == "ceramicImported") {
        percentage.tile = percentage.tile + 1;
      }

      if (reqBody.floorFinishingType == "porcelineLocal") {
        percentage.tile = percentage.tile;
      }

      if (reqBody.floorFinishingType == "porcelineImported") {
        percentage.tile = percentage.tile + 5;
      }


      // logic for carpetry and joinery work

      const carpentryAndJoinery = reqBody.carpentryAndJoinery;

      if (reqBody.carpentryAndJoinery == "low") {
        percentage.carpentryAndJoinery = percentage.carpentryAndJoinery + 1;
      }

      if (reqBody.carpentryAndJoinery == "low1") {
        percentage.carpentryAndJoinery = percentage.carpentryAndJoinery - 0.5;
      }

      if (reqBody.carpentryAndJoinery == "medium") {
        percentage.carpentryAndJoinery = percentage.carpentryAndJoinery - 0.5;
      }

      if (reqBody.carpentryAndJoinery == "medium1") {
        percentage.carpentryAndJoinery = percentage.carpentryAndJoinery - 2;
      }

      if (reqBody.carpentryAndJoinery == "high") {
        percentage.carpentryAndJoinery = percentage.carpentryAndJoinery - 2;
      }

      if (reqBody.carpentryAndJoinery == "high1") {
        percentage.carpentryAndJoinery = percentage.carpentryAndJoinery - 3;
      }

      if (reqBody.carpentryAndJoinery == "best") {
        percentage.carpentryAndJoinery = percentage.carpentryAndJoinery - 3;
      }

      if (reqBody.carpentryAndJoinery == "best1") {
        percentage.carpentryAndJoinery = percentage.carpentryAndJoinery - 4;
      }


      // apply logic for HVAC

      if (reqBody.HVACSystem == "Yes") {
        percentage.HVAC = percentage.HVAC - 1.5;
      }

      // apply logic for fire protection system

      if (reqBody.fireProtectionSystem == "Yes") {
        percentage.fireprotection = percentage.fireprotection - 0.75;
      }

      // apply logic for buiding type

      if (reqBody.buildingType == "commercial" || reqBody.buildingType == "industrial") {
        otherPercentage = otherPercentage + 2.5;
      }

      // apply logic for sanitary installation

      if (reqBody.sanitaryFixtures == "low"){
        percentage.sanitaryFixtures = percentage.sanitaryFixtures + 1;
      }

      // do nothing for medium

      if (reqBody.sanitaryFixtures == "high"){
        percentage.sanitaryFixtures = percentage.sanitaryFixtures - 1.25;
      }

      if (reqBody.sanitaryFixtures == "best"){
        percentage.sanitaryFixtures = percentage.sanitaryFixtures - 2;
      }

            // apply logic for electrical installation

      if (reqBody.electricalMaterial == "low"){
        percentage.electricalMaterial = percentage.electricalMaterial + 1;
      }

      // do nothing for medium

      if (reqBody.electricalMaterial == "high"){
        percentage.electricalMaterial = percentage.electricalMaterial - 1.25;
      }

      if (reqBody.electricalMaterial == "best"){
        percentage.electricalMaterial = percentage.electricalMaterial - 2;
      }


      
      var percentageSum = Object.values(percentage).reduce((a, b) => a + b, 0);
      var remainingPercent = 100 - percentageSum;
      
      // calculate the material cost
      var materialCost = {
        cement: cement * getMaterialPrices().cementPrice,
        sand: sand * getMaterialPrices().sandPrice,
        aggregate: aggregate * getMaterialPrices().aggregatePrice,
        steel: steel * getMaterialPrices().steelPrice,
        HCB: HCB * getMaterialPrices().HCBPrice,
        paint: paint * getMaterialPrices().paintPrice,
        tile: tile * getMaterialPrices()[tileType]
      };

      var materialCostSum = Object.values(materialCost).reduce((a, b) => a + b, 0);
      var remainingMaterialCost = materialCostSum * (remainingPercent / percentageSum);
      var totalCostPermeter = (materialCostSum + remainingMaterialCost) * (100 / (100 - otherPercentage));


      resolve({ totalCostPermeter, cement, sand, aggregate, steel, HCB, paint, tile, paint});
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { calculateTotalMaterialCost };
