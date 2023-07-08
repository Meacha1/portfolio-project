const express = require('express');
const router = express.Router();
const { payment } = require('../../controller');


router.get('/', (req, res) => {
    res.render("beVip")
});

router.post('/', payment.beVip);

module.exports = router;