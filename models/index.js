const dbConfig = require("../config/db-config.js");
const Sequelize = require('sequelize');
const createdb = require('../cost_estimator_db.js');

const sequelize = new Sequelize(dbConfig.DATABASE, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT
});

const db = {};
db.sequelize = sequelize;
db.models = {};
db.models.User = require('./user')(sequelize, Sequelize.DataTypes);
db.models.Project = require('./project')(sequelize, Sequelize.DataTypes);
db.models.Payment = require('./payment')(sequelize, Sequelize.DataTypes);
db.models.MaterialPrice = require('./materialPrice')(sequelize, Sequelize.DataTypes);
db.models.session = require('./session')(sequelize, Sequelize.DataTypes);

module.exports = {
    sequelize,
    models: db.models,
};
