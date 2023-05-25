const { models: { Project } } = require('../models');
const { estimation, calculateArea, calculateTotalMaterialCost } = require('../algorism/test.js');

module.exports = {
  estimate: async (req, res) => {
    const {
      projectName,
      builtUpArea,
      aboveGroundFloor,
      belowGroundFloor,
      floorFinishingType,
      carpentryAndJoinery,
      roofingMaterial,
      HVACSystem,
      fireProtectionSystem,
      buildingType,
      sanitaryFixtures,
      electricalMaterial
    } = req.body;

    const userId = req.session.userId;   //
    if (!userId) {
      res.send("User ID not available");
      return;
    }

    const userProject = await Project.findOne({ where: { projectName, userId } });
    if (userProject) {
      res.send("Project name already exists");
      return;
    }

    
    if (
      projectName &&
      builtUpArea &&
      aboveGroundFloor &&
      belowGroundFloor &&
      floorFinishingType &&
      carpentryAndJoinery &&
      roofingMaterial &&
      HVACSystem &&
      fireProtectionSystem &&
      buildingType &&
      sanitaryFixtures &&
      electricalMaterial
    ) {
      const area = await calculateArea(builtUpArea, aboveGroundFloor, belowGroundFloor);
      const reqBody = req.body;

      const totalmaterialCost = await calculateTotalMaterialCost(reqBody); // Calculate totalmaterialCost

      const costEstimate = estimation(totalmaterialCost, reqBody); // Pass totalmaterialCost to estimation function

      const createdAt = Date.now();
      const updatedAt = Date.now();

      const project = await Project.create({
        projectName,
        builtUpArea,
        aboveGroundFloor,
        belowGroundFloor,
        floorFinishingType,
        carpentryAndJoinery,
        roofingMaterial,
        HVACSystem,
        fireProtectionSystem,
        buildingType,
        sanitaryFixtures,
        electricalMaterial,
        costEstimate,
        createdAt,
        updatedAt,
        userId
      });

      const formattedCostEstimate = costEstimate.toLocaleString();

      res.render('output', {
        projectName,
        builtUpArea,
        costEstimate: formattedCostEstimate,
        createdAt,
        updatedAt,
        area,
        buildingType,
        carpentryAndJoinery,
        roofingMaterial,
        HVACSystem,
        aboveGroundFloor,
        belowGroundFloor,
        buildingType,
        sanitaryFixtures,
        electricalMaterial,
        floorFinishingType,
        fireProtectionSystem
      });
    } else {
      res.send("Not added to the database!");
    }
  },
};
