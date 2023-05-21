let materialPrices = {};

function setMaterialPrices(sandPrice, aggregatePrice, cementPrice) {
  materialPrices = {
    sandPrice,
    aggregatePrice,
    cementPrice
  };
}

function getMaterialPrices() {
  return materialPrices;
}

module.exports = {
  setMaterialPrices,
  getMaterialPrices
};
