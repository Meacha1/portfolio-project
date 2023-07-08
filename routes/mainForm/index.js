const express = require('express');
const { project } = require('../../controller');
const router = express.Router();
const auth = require('../../middleware/auth');

router.get('/', auth, (req, res) => {
    res.render("mainForm")
});

router.post('/', project.estimate);


module.exports = router;