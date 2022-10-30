const { Model, DataTypes } = require('sequelize');

class LikedComments extends Model {
  static define(sequelize) {
    return LikedComments.init({
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'comments',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      originator_id: {
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
    }, {
      tableName: 'liked_comments',
      modelName: 'LikedComments',
      schema: 'public',
      timestamps: false,
      sequelize,
    });
  }

  static totalForUser(id) {
    const { Comments } = this.sequelize.models;

    return this.count({
      col: 'comment_id',
      include: [{
        model: Comments,
        as: 'comment',
        required: true,
        where: {
          originator_id: id,
        },
      }],
    });
  }
}

module.exports = (sequelize) => LikedComments.define(sequelize);