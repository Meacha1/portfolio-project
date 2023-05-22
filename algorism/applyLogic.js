// costCalculator.js

function calculateCostPerSquareMeter(totalmaterialCost, roofingMaterial, HVAC, fireProtection, building, constructionType, sanitaQuantity, electricalQuantity) {
    var costPerSquareMeter = totalmaterialCost; // Assign totalmaterialCost to costPerSquareMeter
  
    if (roofingMaterial == "CIS Roof") {
      costPerSquareMeter += 0;
    } else if (roofingMaterial == "Concrete Slab Roof") {
      costPerSquareMeter += 2000;
    } else {
      costPerSquareMeter -= 1000;
    }
  
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
    
    return costPerSquareMeter;
  }
  
  module.exports = calculateCostPerSquareMeter;
  