const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const MaterialPrice = sequelize.define('materialPrice', 
    {
        item: DataTypes.STRING,
        price: DataTypes.INTEGER
    },
    {
        freezeTableName: true
    });
    return MaterialPrice;
}