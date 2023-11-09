const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const session = sequelize.define(
    "session",
    {
      sid: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      sess: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      expire: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Set default value to current timestamp
      },
    },
    {
      freezeTableName: true,
      timestamps: false, // Disable Sequelize's timestamps (createdAt, updatedAt)
    }
  );

  console.log("Session model is loaded");
  return session;
};
