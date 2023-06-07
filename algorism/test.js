const { calculateTotalMaterialCost } = require('./basePrice.js');

function estimation(totalmaterialCost, reqBody) {
  const area = parseFloat(reqBody.builtUpArea);
  var noOfFloorsAboveGround = parseFloat(reqBody.aboveGroundFloor);
  var noOfFloorsBelowGround = parseFloat(reqBody.belowGroundFloor);
  const roofingMaterial = reqBody.roofingMaterial;
  const HVAC = reqBody.HVACSystem;
  const fireProtection = reqBody.fireProtectionSystem;
  const building = reqBody.buildingType;
  const constructionType = reqBody.constructionType;
  const sanitaQuality = reqBody.sanitaryFixtures;
  const electricalQuality = reqBody.electricalMaterial;

  var costPerSquareMeter = totalmaterialCost; // Assign totalmaterialCost to costPerSquareMeter
  console.log(costPerSquareMeter);

  
  // logic for roof type
  if (roofingMaterial == "Concerete Slab Roof") {
    noOfFloorsAboveGround = noOfFloorsAboveGround + 0.45;   // considering the roof slabs steel and cements
  }
  const grosArea = calculateArea(area, noOfFloorsAboveGround, noOfFloorsBelowGround);
  const totalCost = grosArea * costPerSquareMeter;
  return totalCost;
}

function calculateArea(area, noOfFloorsAboveGround, noOfFloorsBelowGround) {
  const totalArea = parseFloat(area) * (parseFloat(noOfFloorsAboveGround) + parseFloat(noOfFloorsBelowGround) + 1);
  return parseFloat(totalArea);
}

module.exports = { estimation, calculateArea, calculateTotalMaterialCost };







  