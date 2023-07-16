'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create MaterialPrice table
    await queryInterface.createTable('MaterialPrices', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      item: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Create Payment table
    await queryInterface.createTable('Payments', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Create Project table
    await queryInterface.createTable('Projects', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      projectName: {
        type: DataTypes.STRING,
      },
      builtUpArea: {
        type: DataTypes.INTEGER,
      },
      aboveGroundFloor: {
        type: DataTypes.INTEGER,
      },
      belowGroundFloor: {
        type: DataTypes.INTEGER,
      },
      floorFinishingType: {
        type: DataTypes.STRING,
      },
      carpentryAndJoinery: {
        type: DataTypes.STRING,
      },
      roofingMaterial: {
        type: DataTypes.STRING,
      },
      HVACSystem: {
        type: DataTypes.STRING,
      },
      fireProtectionSystem: {
        type: DataTypes.STRING,
      },
      buildingType: {
        type: DataTypes.STRING,
      },
      sanitaryFixtures: {
        type: DataTypes.STRING,
      },
      electricalMaterial: {
        type: DataTypes.STRING,
      },
      costEstimate: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      userId: {
        type: DataTypes.INTEGER,
      },
    });

    // Create User table
    await queryInterface.createTable('Users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      projectCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isVIP: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add foreign key constraints if needed
    await queryInterface.addConstraint('Payments', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_payment_user',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('Projects', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_project_user',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order
    await queryInterface.dropTable('Projects');
    await queryInterface.dropTable('Payments');
    await queryInterface.dropTable('MaterialPrices');
    await queryInterface.dropTable('Users');
  },
};
