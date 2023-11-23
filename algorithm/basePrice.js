const { INTEGER } = require('sequelize');
const { models: { MaterialPrice } } = require('../models');

// percentage other than material

var otherPercentage = 40;   // 40% of total project cost, this includes labor cost, equipment, transportation cost, etc.

// Material cost per meter square
const calculateTotalMaterialCost = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {        
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
      //const { sandPrice, aggregatePrice, cementPrice, steelPrice, HCBPrice, paintPrice, marbleLocalPrice, graniteLocalPrice, graniteImportedPrice, ceramicLocalPrice, ceramicImportedPrice, porcelineLocalPrice, porcelineImportedPrice } = 
     
      const sandPrice = await MaterialPrice.findOne({ where: { item: 'sand' } }).then((data) => data.price);
      const aggregatePrice = await MaterialPrice.findOne({ where: { item: 'aggregate' } }).then((data) => data.price);
      const cementPrice = await MaterialPrice.findOne({ where: { item: 'cement' } }).then((data) => data.price);
      const steelPrice = await MaterialPrice.findOne({ where: { item: 'steel' } }).then((data) => data.price);
      const HCBPrice = await MaterialPrice.findOne({ where: { item: 'HCB' } }).then((data) => data.price);
      const paintPrice = await MaterialPrice.findOne({ where: { item: 'paint' } }).then((data) => data.price);
      const marbleLocalPrice = await MaterialPrice.findOne({ where: { item: 'marbleLocal' } }).then((data) => data.price);
      const graniteLocalPrice = await MaterialPrice.findOne({ where: { item: 'graniteLocal' } }).then((data) => data.price);
      const graniteImportedPrice = await MaterialPrice.findOne({ where: { item: 'graniteImported' } }).then((data) => data.price);
      const ceramicLocalPrice = await MaterialPrice.findOne({ where: { item: 'ceramicLocal' } }).then((data) => data.price);
      const ceramicImportedPrice = await MaterialPrice.findOne({ where: { item: 'ceramicImported' } }).then((data) => data.price);
      const porcelineLocalPrice = await MaterialPrice.findOne({ where: { item: 'porcelineLocal' } }).then((data) => data.price);
      const porcelineImportedPrice = await MaterialPrice.findOne({ where: { item: 'porcelineImported' } }).then((data) => data.price);

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

      var tileType = reqBody.floorFinishingType + "Price";
      if (reqBody.floorFinishingType == "marbleLocal") {
        tileType = marbleLocalPrice;
      }
      if (reqBody.floorFinishingType == "graniteLocal") {
        tileType = graniteLocalPrice;
      }
      if (reqBody.floorFinishingType == "graniteImported") {
        tileType = graniteImportedPrice;
      }
      if (reqBody.floorFinishingType == "ceramicLocal") {
        tileType = ceramicLocalPrice;
      }
      if (reqBody.floorFinishingType == "ceramicImported") {
        tileType = ceramicImportedPrice;
      }
      if (reqBody.floorFinishingType == "porcelineLocal") {
        tileType = porcelineLocalPrice;
      }
      if (reqBody.floorFinishingType == "porcelineImported") {
        tileType = porcelineImportedPrice;
      }


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

      if (carpentryAndJoinery == "low") {
        percentage.carpentryAndJoinery = percentage.carpentryAndJoinery + 1;
      }

      if (carpentryAndJoinery == "low1") {
        percentage.carpentryAndJoinery = percentage.carpentryAndJoinery - 0.5;
      }

      if (carpentryAndJoinery == "medium") {
        percentage.carpentryAndJoinery = percentage.carpentryAndJoinery - 0.5;
      }

      if (carpentryAndJoinery == "medium1") {
        percentage.carpentryAndJoinery = percentage.carpentryAndJoinery - 2;
      }

      if (carpentryAndJoinery == "high") {
        percentage.carpentryAndJoinery = percentage.carpentryAndJoinery - 2;
      }

      if (carpentryAndJoinery == "high1") {
        percentage.carpentryAndJoinery = percentage.carpentryAndJoinery - 3;
      }

      if (carpentryAndJoinery == "best") {
        percentage.carpentryAndJoinery = percentage.carpentryAndJoinery - 3;
      }

      if (carpentryAndJoinery == "best1") {
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
        cement: cement * cementPrice,
        sand: sand * sandPrice,
        aggregate: aggregate * aggregatePrice,
        steel: steel * steelPrice,
        HCB: HCB * HCBPrice,
        paint: paint * paintPrice,
        tile: tile *tileType,
      };

      console.log('materialCost: ', materialCost);

      var materialCostSum = Object.values(materialCost).reduce((a, b) => a + b, 0);
      console.log('materialCostSum: ', materialCostSum);
      var remainingMaterialCost = materialCostSum * (remainingPercent / percentageSum);
      var totalCostPermeter = (materialCostSum + remainingMaterialCost) * (100 / (100 - otherPercentage));
      // cast the totalCostPermeter to an integer
      totalCostPermeter = Math.round(totalCostPermeter);
      console.log('totalCostPermeter: ', totalCostPermeter);


      resolve({ totalCostPermeter, cement, sand, aggregate, steel, HCB, paint, tile, paint});
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { calculateTotalMaterialCost };
