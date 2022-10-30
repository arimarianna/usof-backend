const { Model, DataTypes } = require('sequelize');

class Roles extends Model {
  static define(sequelize) {
    return Roles.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    }, {
      tableName: 'roles',
      modelName: 'Roles',
      schema: 'public',
      timestamps: false,
      sequelize,
    });
  }
}

module.exports = (sequelize) => Roles.define(sequelize);