const { Model, DataTypes } = require('sequelize');

class Categories extends Model {
  static define(sequelize) {
    return Categories.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, {
      tableName: 'categories',
      modelName: 'Categories',
      schema: 'public',
      timestamps: false,
      sequelize,
    });
  }

  static async findById(id) {
    const result = await this.findOne({
      where: {
        id,
      },
    });

    return result?.toJSON();
  }
}

module.exports = (sequelize) => Categories.define(sequelize);