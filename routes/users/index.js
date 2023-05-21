const express = require('express');
//we dont need to create app object here because we already created it in the main index.js file
const router = express.Router();

router.get('/', (req, res) => {
    res.send('<h1>User Route</h1>');
});

router.get('/:username', (req, res) => {
    // views/profile
    res.render("profile", {username: req.params.username});
});

module.exports = router;