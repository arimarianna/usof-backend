const { Model, DataTypes, Op } = require('sequelize');

const LIMITS = 10;

class Posts extends Model {
  static define(sequelize) {
    return Posts.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      originator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isInactive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, {
      tableName: 'posts',
      modelName: 'Posts',
      schema: 'public',
      timestamps: true,
      sequelize,
    });
  }

  static findOneWithOriginator(id) {
    const { Users } = this.sequelize.models;

    return this.findOne({
      where: { id },
      include: [{
        model: Users,
        as: 'originator',
        attributes: ['id', 'login', 'name', 'avatar'],
      }],
    });
  }

  static async findAllWithOriginator(page, filter, sort) {
    const { Users, PostsCategories } = this.sequelize.models;

    const offset = LIMITS * (page - 1);

    const where = {};

    if (filter.date) {
      where.createdAt = { [Op.between]: [filter.start, filter.end] };
    }

    const include = [];

    if (filter.category) {
      include.push({
        model: PostsCategories,
        as: 'posts_categories',
        attributes: [],
        where: {
          category_id: filter.category,
        },
      });
    }

    const count = this.count({
      col: 'id',
      include,
      where,
    });

    const find = this.findAll({
      include: [{
        model: Users,
        as: 'originator',
        attributes: ['id', 'login', 'name', 'avatar'],
      }, ...include],
      where,
      offset,
      limit: LIMITS,
      order: [['createdAt', sort]],
    });

    const [result, all] = await Promise.all([find, count]);

    return { result, pages: Math.ceil(all / LIMITS) };
  }

  static findPostWithLikes(id) {
    const { LikedPosts, Users } = this.sequelize.models;

    return this.findOne({
      where: { id },
      include: [{
        model: LikedPosts,
        as: 'liked_posts',
        include: [{
          model: Users,
          as: 'originator',
          attributes: ['id', 'login', 'name', 'avatar'],
        }],
      }],
    });
  }
}

module.exports = (sequelize) => Posts.define(sequelize);