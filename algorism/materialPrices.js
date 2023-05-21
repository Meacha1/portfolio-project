let materialPrices = {};

function setMaterialPrices(sandPrice, aggregatePrice, cementPrice, steelPrice, HCBPrice, paintPrice, tilePrice) {
  materialPrices = {
    sandPrice,
    aggregatePrice,
    cementPrice,
    steelPrice,
    HCBPrice,
    paintPrice,
    tilePrice
  };
}

function getMaterialPrices() {
  return materialPrices;
}

module.exports = {
  setMaterialPrices,
  getMaterialPrices
};
