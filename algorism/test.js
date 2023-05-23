const { calculateTotalMaterialCost } = require('./basePrice.js');

function estimation(totalmaterialCost, reqBody) {
  const area = parseInt(reqBody.builtUpArea);
  const noOfFloorsAboveGround = parseInt(reqBody.aboveGroundFloor);
  const noOfFloorsBelowGround = parseInt(reqBody.belowGroundFloor);
  const grosArea = calculateArea(area, noOfFloorsAboveGround, noOfFloorsBelowGround);
  const roofingMaterial = reqBody.roofingMaterial;
  const HVAC = reqBody.HVACSystem;
  const fireProtection = reqBody.fireProtectionSystem;
  const building = reqBody.buildingType;
  const constructionType = reqBody.constructionType;
  const sanitaQuality = reqBody.sanitaryFixtures;
  const electricalQuality = reqBody.electricalMaterial;

  var costPerSquareMeter = totalmaterialCost; // Assign totalmaterialCost to costPerSquareMeter
  console.log(costPerSquareMeter);

  

  
  const totalCost = grosArea * costPerSquareMeter;
  return totalCost;
}

function calculateArea(area, noOfFloorsAboveGround, noOfFloorsBelowGround) {
  const totalArea = parseInt(area) * (parseInt(noOfFloorsAboveGround) + parseInt(noOfFloorsBelowGround) + 1);
  return parseFloat(totalArea);
}

module.exports = { estimation, calculateArea, calculateTotalMaterialCost };







  