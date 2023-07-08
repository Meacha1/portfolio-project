const express = require('express');
const router = express.Router();
const { payment } = require('../../controller');
const auth = require('../../middleware/auth');


router.get('/',auth, (req, res) => {
    res.render("beVip")
});

router.post('/', payment.beVip);

module.exports = router;