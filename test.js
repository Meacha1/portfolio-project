function estimation(reqBody) {
  const area = parseInt(reqBody.builtUpArea);
  const noOfFloorsAboveGround = parseInt(reqBody.aboveGroundFloor);
  const noOfFloorsBelowGround = parseInt(reqBody.belowGroundFloor);
  const grosArea = calculateArea(area, noOfFloorsAboveGround, noOfFloorsBelowGround);
  const roofingMaterial = reqBody.roofingMaterial;
  const HVAC = reqBody.HVACSystem;
  const fireProtection = reqBody.fireProtectionSyste;
  const building = reqBody.buildingType;
  const constructionType = reqBody.constructionType;
  const sanitaQuantity = reqBody.sanitaryFixtures;
  const electricalQuantity = reqBody.electricalMaterial;

  var costPerSquareMeter = 30000;

  if (roofingMaterial == "CIS Roof") {
    costPerSquareMeter += 0;
  } else if (roofingMaterial == "Concerete Slab Roof") {
    costPerSquareMeter += 2000;
  } else {
    costPerSquareMeter -= 1000;
  };

  if (HVAC == "Yes") {
    costPerSquareMeter += 3000;
  } else {
    costPerSquareMeter -= 1000;
  }

  if (fireProtection == "Yes") {
    costPerSquareMeter += 5000;
  } else {
    costPerSquareMeter -= 1000;
  }
   if (building == "residential") {
    costPerSquareMeter += 2000;
  } else {
    costPerSquareMeter -= 1000;
  }
    if (constructionType == "concrete") {
    costPerSquareMeter += 2000;
  } else {
    costPerSquareMeter -= 1000;
  }
    if (sanitaQuantity == "high") {
    costPerSquareMeter += 1000;
  } else {
    costPerSquareMeter -= 1000;
  }
    if (electricalQuantity == "high") {
    costPerSquareMeter += 2000;
  } else {
    costPerSquareMeter -= 2000;
  }
  const totalCost = grosArea * costPerSquareMeter;
  return totalCost;
}

function calculateArea(area, noOfFloorsAboveGround, noOfFloorsBelowGround) {
  const totalArea = parseInt(area) * (parseInt(noOfFloorsAboveGround) + parseInt(noOfFloorsBelowGround) + 1);
  return parseFloat(totalArea);
}

module.exports = { estimation, calculateArea };