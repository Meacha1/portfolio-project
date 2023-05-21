const { models: { User } } = require('../models');

module.exports = {
    login: async (req, res, next) => {
        if (req.body.email && req.body.password) {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email, password } });
            if (user) {
                const username = user.username;
                res.render('mainForm', { username });
            } else {
                res.send("Wrong password!")
            }
        } else {
            res.send("Not added to the database!")
        }
    },
    createAccount: async (req, res) => {
        if (req.body.email && req.body.username &&
             req.body.password &&
             req.body.password2 &&
             req.body.password === req.body.password2 &&
             req.body.password.length >= 8
             ) {
            const { email, username, password, password2 } = req.body;
            const user = await User.findOne({ where: { email, username } });
            
            if (user) {
                res.render('sorry');
            }
            await User.create({ email, username, password });
            res.render('congratulationsUser', { username });
        } else {
        res.send("Not added to the database!")
    }
} 
};