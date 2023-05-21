const { models: { Project } } = require('../models');
const { estimation, calculateArea } = require('../test.js');

module.exports = {
    estimate: async (req, res) => {
        const { projectName,
            builtUpArea,
            aboveGroundFloor,
            belowGroundFloor,
            finishingQuality,
            roofingMaterial,
            HVACSystem,
            fireProtectionSystem,
            buildingType,
            constructionType,
            finishingMaterial,
            sanitaryFixtures,
            electricalMaterial
          } = req.body;
        if (req.body.projectName &&
            req.body.builtUpArea &&
            req.body.aboveGroundFloor &&
            req.body.belowGroundFloor &&
            req.body.finishingQuality &&
            req.body.roofingMaterial &&
            req.body.HVACSystem &&
            req.body.fireProtectionSyste &&
            req.body.buildingType &&
            req.body.constructionType &&
            req.body.finishingMaterial &&
            req.body.sanitaryFixtures &&
            req.body.electricalMaterial
            ) {
                const area = calculateArea(builtUpArea, aboveGroundFloor, belowGroundFloor);
                const reqBody = req.body;
                const costEstimate = estimation(reqBody).toLocaleString();
                const createdAt = Date.now();
                const updatedAt = Date.now();

                res.render('output', { projectName, area, costEstimate, createdAt, updatedAt });

        } else {
            res.send("Not added to the database!")
        }
    }

};