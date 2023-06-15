const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const MaterialPrice = sequelize.define('materialPrice', {
        item: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        freezeTableName: true
    });

    console.log('MaterialPrice table is created');
    return MaterialPrice;
};
