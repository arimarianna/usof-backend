const { Model, DataTypes } = require('sequelize');

class Comments extends Model {
  static define(sequelize) {
    return Comments.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ref_sub: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      originator_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      ref: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'posts',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
    }, {
      tableName: 'comments',
      modelName: 'Comments',
      schema: 'public',
      timestamps: true,
      sequelize,
    });
  }

  static async findById(id, include = []) {
    const result = await this.findOne({
      include,
      where: {
        id,
      },
    });

    return result?.toJSON();
  }

  static findByIdWithLikes(id) {
    const { LikedComments, Users } = this.sequelize.models;

    return this.findById(id, [{
      model: LikedComments,
      as: 'liked_comments',
      include: [{
        model: Users,
        as: 'originator',
        attributes: ['id', 'login', 'name', 'avatar'],
      }],
    }]);
  }

  static async getForPost(ref) {
    const { Users } = this.sequelize.models;

    const result = await this.findAll({
      include: [{
        model: Users,
        as: 'originator',
        attributes: ['id', 'login', 'name', 'avatar'],
      }],
      where: {
        ref,
      },
    });

    return result;
  } getForSub;

  static async getForSub(ref_sub) {
    const { Users } = this.sequelize.models;

    const result = await this.findAll({
      include: [{
        model: Users,
        as: 'originator',
        attributes: ['id', 'login', 'name', 'avatar'],
      }],
      where: {
        ref_sub,
      },
    });

    return result;
  }
}

module.exports = (sequelize) => Comments.define(sequelize);