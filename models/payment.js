const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "payment",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // because in the api for SMS, we don't have userId
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transaction_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transaction_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transaction_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expiry_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
        updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        },
    },
    {
      freezeTableName: true,
    }
  );

  return Payment;
};
