const express = require('express');
const router = express.Router();
const { user } = require('../../controller');


router.get('/', (req, res) => {
    res.render("forgetPassword")
});

router.post('/', user.forgetPassword);


module.exports = router;