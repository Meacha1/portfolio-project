const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    'project',
    {
      projectName: DataTypes.STRING,
      builtUpArea: DataTypes.INTEGER,
      aboveGroundFloor: DataTypes.INTEGER,
      belowGroundFloor: DataTypes.INTEGER,
      floorFinishingType: DataTypes.STRING,
      carpentryAndJoinery: DataTypes.STRING,
      roofingMaterial: DataTypes.STRING,
      HVACSystem: DataTypes.STRING,
      fireProtectionSystem: DataTypes.STRING,
      buildingType: DataTypes.STRING,
      sanitaryFixtures: DataTypes.STRING,
      electricalMaterial: DataTypes.STRING,
      costEstimate: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      userId: DataTypes.INTEGER
    },
    {
      freezeTableName: true,
      // Define the update function to update a project
    }
  );

  console.log("Project model is loaded");
  return Project;
};
