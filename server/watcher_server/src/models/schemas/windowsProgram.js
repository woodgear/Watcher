module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('WindowsProgram', {
        startTime: DataTypes.DATE,
        endTime: DataTypes.DATE,
        duration: DataTypes.INTEGER,
        tile:DataTypes.STRING,
        name:DataTypes.STRING,
        path:DataTypes.STRING,
    }
    );
    return User;
};