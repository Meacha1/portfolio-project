const { models: { Project } } = require('../models');
const { estimation, calculateArea, calculateTotalMaterialCost } = require('../algorithm/test.js');

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

      const costEstimate = estimation(totalmaterialCost, reqBody);

      const cement = parseInt(totalmaterialCost.cement * area).toLocaleString();
      const sand = parseInt(totalmaterialCost.sand * area).toLocaleString();
      const aggregate = parseInt(totalmaterialCost.aggregate * area).toLocaleString();
      const steel = parseInt(totalmaterialCost.steel * area).toLocaleString();
      const HCB = parseInt(totalmaterialCost.HCB * area).toLocaleString();
      const paint = parseInt(totalmaterialCost.paint * area).toLocaleString();
      const tile = parseInt(totalmaterialCost.tile * area).toLocaleString();
      
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

      const formattedCostEstimate = parseInt(costEstimate).toLocaleString();

      const selectionMap = {
        low: "Low-quality internal door with local material, no built-in cupboard, and cabinets",
        low1: "Low-quality internal door, built-in cupboard, and cabinets with local material",
        medium:  "Medium-quality internal door with local material no built-in cupboard, and cabinets",
        medium1: "Medium-quality internal door, built-in cupboard, and cabinets with local material",
        high: "High-quality internal door with imported material, no built-in cupboard, and cabinets",
        high1: "High-quality internal door, built-in cupboard, and cabinets with imported material",
        best: "Best-quality internal door with imported material no built-in cupboard, and cabinets",
        best1: "Best-quality internal door, built-in cupboard, and cabinets with imported material",
        porcelineLocal: "Porceline Local",
        porcelineImported: "Porceline Imported",
        ceramicLocal: "Ceramic Local",
        ceramicImported: "Ceramic Imported",
        graniteLocal: "Granite Local",
        graniteImported: "Granite Imported",
        marbleLocal: "Marble Local",
      };

      res.render('output', {
        projectName,
        builtUpArea,
        costEstimate: formattedCostEstimate,
        createdAt,
        updatedAt,
        area,
        buildingType,
        carpentryAndJoinery: selectionMap[carpentryAndJoinery],
        roofingMaterial,
        HVACSystem,
        aboveGroundFloor,
        belowGroundFloor,
        buildingType,
        sanitaryFixtures,
        electricalMaterial,
        floorFinishingType: selectionMap[floorFinishingType],
        fireProtectionSystem,
        cement,
        sand,
        aggregate,
        steel,
        HCB,
        tile,
        paint
      });
    } else {
      res.send("Not added to the database!");
    }
  },
  updateProject: async (req, res, userId, projectId) => {
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
    
    console.log(`my project is ${projectId}`)

    if (!userId) {
      res.send("User ID not available");
      return;
    }
  
    const project = await Project.findOne({ where: { projectName, userId } });
    if (!project) {
      res.send("Project not found");
      return;
    }
  
    const area = await calculateArea(builtUpArea, aboveGroundFloor, belowGroundFloor);
    const reqBody = req.body;
    const totalmaterialCost = await calculateTotalMaterialCost(reqBody);
    const costEstimate = estimation(totalmaterialCost, reqBody);

    const cement = parseInt(totalmaterialCost.cement * area).toLocaleString();
    const sand = parseInt(totalmaterialCost.sand * area).toLocaleString();
    const aggregate = parseInt(totalmaterialCost.aggregate * area).toLocaleString();
    const steel = parseInt(totalmaterialCost.steel * area).toLocaleString();
    const HCB = parseInt(totalmaterialCost.HCB * area).toLocaleString();
    const paint = parseInt(totalmaterialCost.paint * area).toLocaleString();
    const tile = parseInt(totalmaterialCost.tile * area).toLocaleString();
  
    
    const updatedProject = await project.update(
      {
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
        updatedAt: Date.now()
      },
      { where: { projectName, userId } }
    );
  
    const formattedCostEstimate = parseInt(costEstimate).toLocaleString();

    const selectionMap = {
      low: "Low-quality internal door with local material, no built-in cupboard, and cabinets",
      low1: "Low-quality internal door, built-in cupboard, and cabinets with local material",
      medium:  "Medium-quality internal door with local material no built-in cupboard, and cabinets",
      medium1: "Medium-quality internal door, built-in cupboard, and cabinets with local material",
      high: "High-quality internal door with imported material, no built-in cupboard, and cabinets",
      high1: "High-quality internal door, built-in cupboard, and cabinets with imported material",
      best: "Best-quality internal door with imported material no built-in cupboard, and cabinets",
      best1: "Best-quality internal door, built-in cupboard, and cabinets with imported material",
      porcelineLocal: "Porceline Local",
      porcelineImported: "Porceline Imported",
      ceramicLocal: "Ceramic Local",
      ceramicImported: "Ceramic Imported",
      graniteLocal: "Granite Local",
      graniteImported: "Granite Imported",
      marbleLocal: "Marble Local",
    };
  
    res.render('output', {
      projectName,
      builtUpArea,
      costEstimate: formattedCostEstimate,
      createdAt: updatedProject.createdAt,
      updatedAt: updatedProject.updatedAt,
      area,
      buildingType,
      carpentryAndJoinery: selectionMap[carpentryAndJoinery],
      roofingMaterial,
      HVACSystem,
      aboveGroundFloor,
      belowGroundFloor,
      buildingType,
      sanitaryFixtures,
      electricalMaterial,
      floorFinishingType: selectionMap[floorFinishingType],
      fireProtectionSystem,
      cement,
      sand,
      aggregate,
      steel,
      HCB,
      tile,
      paint
    });
  },
  deleteProject: async (req, res, userId, projectName) => {
    if (!userId) {
      res.send("User ID not available");
      return;
    }
  
    if (!projectName) {
      res.send("Project name not provided");
      return;
    }
  
    const project = await Project.findOne({ where: { userId, projectName } });
    if (!project) {
      res.send("Project not found");
      return;
    }
  
    // Perform the deletion logic here
    await project.destroy();
  },
};