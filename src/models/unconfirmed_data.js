const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => UnconfirmedData.define(sequelize);

class UnconfirmedData extends Model {
  static define(sequelize) {
    return UnconfirmedData.init({
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isRegister: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    }, {
      tableName: 'unconfirmed_data',
      modelName: 'UnconfirmedData',
      schema: 'public',
      timestamps: false,
      sequelize,
    });
  }

  static async findByUserId(user_id = -1) {
    const result = await this.findOne({
      where: { user_id },
    });

    return result?.toJSON();
  }

  static async findByKey(key) {
    const result = await this.findOne({
      where: { key },
    });

    return result?.toJSON();
  }
}
