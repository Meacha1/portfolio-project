const { calculateTotalMaterialCost } = require('./basePrice.js');


function estimation(materialCostResult, reqBody) {
  const area = parseFloat(reqBody.builtUpArea);
  var noOfFloorsAboveGround = parseFloat(reqBody.aboveGroundFloor);
  var noOfFloorsBelowGround = parseFloat(reqBody.belowGroundFloor);
  const roofingMaterial = reqBody.roofingMaterial;

  var costPerSquareMeter = materialCostResult.totalCostPermeter;
  var cement = materialCostResult.cement;
  console.log(`construction cost per meter square is: ${costPerSquareMeter}`);
  console.log(`cement per meter square: ${cement}`);

  
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







  