const express = require("express");
const router = express.Router();


router.get('/', (request, response) => {
    console.log(request.cookies);    // request.cookies must be placed before the response.send
    response.send("This is the page of the posts")
});

module.exports = router;