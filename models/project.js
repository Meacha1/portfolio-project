const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('project', 
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
        updatedAt: DataTypes.DATE
    },
    {
        freezeTableName: true
    });

    return Project;
};