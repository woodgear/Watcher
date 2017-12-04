module.exports = function (sequelize, DataTypes) {
  const status = sequelize.define("state", {
    reporter: DataTypes.STRING,
    start: Sequelize.DATE,
    end: Sequelize.DATE,
    content: DataTypes.STRING
  });

  return User;
};