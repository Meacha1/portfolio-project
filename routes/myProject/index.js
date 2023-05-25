const express = require('express');
const { project } = require('../../controller');
const router = express.Router();


router.get('/', (req, res) => {
    res.render("displayProject")
});

module.exports = router;