const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {  // we export a middleware function

    console.log(`my test user id is: ${req.session.userId}`);
    try {
        const token = req.headers.authorization.split(' ')[1]; // we extract the token from the authorization header of the incoming request
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // we use the verify function to decode our token
        const userId = decodedToken.userId;

        console.log(`my test user id is: ${userId}`);
        console.log(`my test token is: ${token}`);

        if (req.session.userId && req.session.userId !== userId) {  // if the request contains a userId, we compare it to the one extracted from the token
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.render("login");
    }
};