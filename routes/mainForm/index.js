const express = require('express');
const { project } = require('../../controller');
const router = express.Router();

function Authenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/', Authenticated, (req, res) => {
    res.render("mainForm")
});

router.post('/', project.estimate);


module.exports = router;