const { Model, DataTypes } = require('sequelize');

class PostsCategories extends Model {
  static define(sequelize) {
    return PostsCategories.init({
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
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'categories',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
    }, {
      tableName: 'posts_categories',
      modelName: 'PostsCategories',
      schema: 'public',
      timestamps: false,
      sequelize,
    });
  }

  static async findByPostId(post_id) {
    const { Categories } = this.sequelize.models;

    const result = await this.findAll({
      where: {
        post_id,
      },
      include: [{
        model: Categories,
        as: 'category',
      }],
    });

    return result;
  }
}

module.exports = (sequelize) => PostsCategories.define(sequelize);