const { Model, DataTypes } = require('sequelize');

class LikedPosts extends Model {
  static define(sequelize) {
    return LikedPosts.init({
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'posts',
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
      tableName: 'liked_posts',
      modelName: 'LikedPosts',
      schema: 'public',
      timestamps: false,
      sequelize,
    });
  }

  static totalForUser(id) {
    const { Posts } = this.sequelize.models;

    return this.count({
      col: 'post_id',
      include: [{
        model: Posts,
        as: 'post',
        required: true,
        where: {
          originator_id: id,
        },
      }],
    });
  }
}

module.exports = (sequelize) => LikedPosts.define(sequelize);