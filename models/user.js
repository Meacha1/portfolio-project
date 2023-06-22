const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      hooks: {
        beforeCreate: async (user) => {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(user.password, saltRounds);
          user.password = hashedPassword;
        },
      },
    }
  );

  // Instance method to compare passwords during authentication
  User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
