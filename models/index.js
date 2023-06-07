const dbConfig = require("../config/db-config.js");
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DATABASE, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT
});

const db = {};
db.sequelize = sequelize;
db.models = {};
db.models.Session = require('./session.js')(sequelize, Sequelize.DataTypes)
db.models.User = require('./user')(sequelize, Sequelize.DataTypes);
db.models.Project = require('./project')(sequelize, Sequelize.DataTypes);
db.models.MaterialPrice = require('./materialPrice')(sequelize, Sequelize.DataTypes);
module.exports = db;

module.exports = {
    sequelize,
    models: db.models,
  };