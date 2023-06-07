const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const MaterialPrice = sequelize.define('materialPrice', 
    {
        item: DataTypes.STRING,
        price: DataTypes.FLOAT
    },
    {
        freezeTableName: true
    });

    console.log('MaterialPrice table is created');
    return MaterialPrice;
}