const e = require('express');
const { models: { Payment} } = require('../models');
const { models: { User } } = require('../models');

module.exports = {
    beVip: async (req, res) => {
        const { transaction_number } = req.body;
        const userId = req.session.userId;
        if (!userId) {
            res.send("User ID not available");
            return;
        }
        const payment = await Payment.findOne({ where: { transaction_number } });
        if (payment && payment.transaction_amount >= 5) {  // 5 is the minimum amount for VIP
            if (!payment.userId) {  // if the user 
                await Payment.update({ userId: userId }, { where: { transaction_number } });
                await User.update({ isVIP: true }, { where: { id: userId } });
                const remainingDays = Math.floor((payment.expiry_date - Date.now()) / (1000 * 60 * 60 * 24));
                res.send(`<h1>Congratulations! You are now a VIP. You have ${remainingDays} days left</h1>
                    <a href="/login">login</a>
                `);                
            } else {
                res.send("Transaction number already used");
                return;
            }                
        } else {
            res.send("<h1>Transaction number not found<h1>");
            return;
        }
    },
    isExpired: async (req, res) => {
        const userId = req.session.userId;
        if (!userId) {
            res.send("User ID not available");
            return;
        }
        const payment = await Payment.findOne({ where: { userId } });
        if (!payment) {
            await User.update({ isVIP: false }, { where: { id: userId } });
            return;
        }
        const remainingDays = Math.floor((payment.expiry_date - Date.now()) / (1000 * 60 * 60 * 24));
        console.log(`The reamaing days are ${remainingDays}`);
        if (remainingDays < 0) {
            await User.update({ isVIP: false }, { where: { id: userId } });
        } else {
            await User.update({ isVIP: true }, { where: { id: userId } });
            console.log("The user is still a VIP");
        }
    }
};

