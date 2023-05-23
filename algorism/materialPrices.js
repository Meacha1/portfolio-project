let materialPrices = {};

function setMaterialPrices(sandPrice, aggregatePrice, cementPrice, steelPrice, HCBPrice, paintPrice, marbleLocalPrice, graniteLocalPrice, graniteImportedPrice, ceramicLocalPrice, ceramicImportedPrice, porcelineLocalPrice, porcelineImportedPrice) {
  materialPrices = {
    sandPrice,
    aggregatePrice,
    cementPrice,
    steelPrice,
    HCBPrice,
    paintPrice,
    marbleLocalPrice,
    graniteLocalPrice,
    graniteImportedPrice,
    ceramicLocalPrice,
    ceramicImportedPrice,
    porcelineLocalPrice,
    porcelineImportedPrice
  };
}

function getMaterialPrices() {
  return materialPrices;
}

module.exports = {
  setMaterialPrices,
  getMaterialPrices
};
