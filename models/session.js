const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    'session',
    {
      sid: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      expires: DataTypes.DATE,
      data: DataTypes.TEXT
    },
    {
      freezeTableName: true,
      timestamps: false
    }
  );
  
  return Session;
};