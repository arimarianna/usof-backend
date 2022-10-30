const { Model, DataTypes, col } = require('sequelize');

class Users extends Model {
  static define(sequelize) {
    return Users.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    }, {
      tableName: 'users',
      modelName: 'Users',
      schema: 'public',
      timestamps: false,
      sequelize,
    });
  }

  static async findByLogin(login = '', excludePass = false) {
    const { Roles } = this.sequelize.models;

    const exclude = ['role_id'];

    if (excludePass) {
      exclude.push('password');
    }

    const result = await this.findOne({
      include: [{
        model: Roles,
        as: 'role',
        attributes: [],
      }],
      where: {
        login,
      },
      attributes: {
        include: [[col('role.name'), 'urole']],
        exclude,
      },
    });

    return result?.toJSON();
  }

  static async findByEmail(email = '') {
    const { Roles } = this.sequelize.models;

    const result = await this.findOne({
      include: [{
        model: Roles,
        as: 'role',
        attributes: [],
      }],
      where: {
        email,
      },
      attributes: {
        include: [[col('role.name'), 'urole']],
        exclude: ['role_id', 'password'],
      },
    });

    return result?.toJSON();
  }

  static async findWithRoles() {
    const { Roles } = this.sequelize.models;

    const result = await this.findAll({
      include: [{
        model: Roles,
        as: 'role',
        attributes: [],
      }],
      attributes: {
        include: [[col('role.name'), 'urole']],
        exclude: ['role_id', 'password'],
      },
    });

    return result;
  }

  static async findById(id) {
    const { Roles } = this.sequelize.models;

    const result = await this.findOne({
      include: [{
        model: Roles,
        as: 'role',
        attributes: [],
      }],
      where: {
        id,
      },
      attributes: {
        include: [[col('role.name'), 'urole']],
        exclude: ['role_id', 'password'],
      },
    });

    return result?.toJSON();
  }
}

module.exports = (sequelize) => Users.define(sequelize);