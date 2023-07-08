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
        set(value) {
          const hashedPassword = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hashedPassword);
        },
      },
      projectCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isVIP: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  // Instance method to compare passwords during authentication
  User.prototype.isValidPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
