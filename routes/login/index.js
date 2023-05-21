const express = require('express');
const router = express.Router();
const { user } = require('../../controller');


router.get('/', (req, res) => {
    res.render("login")
});

router.post('/', user.login);


module.exports = router;