const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {  // we export a middleware function
    try {
        const token = req.headers.authorization.split(' ')[1]; // we extract the token from the authorization header of the incoming request
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // we use the verify function to decode our token
        const userId = decodedToken.userId;
        req.userId = userId; // we add the userId to the request object
        req.auth = { userId }
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.render("login");
    }
};