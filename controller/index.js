const controller =  {};

controller.user = require('./user');
controller.project = require('./project');
controller.payment = require('./payment');

module.exports = controller;