const express = require('express');
const router = express.Router();
const { user } = require('../../controller');


router.get('/', (req, res) => {
    res.render("createUser")
});

router.post('/', user.createAccount);


module.exports = router;