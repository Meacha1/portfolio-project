const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', 
    {
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING
    },
    {
        freezeTableName: true
    });
    return User;
}