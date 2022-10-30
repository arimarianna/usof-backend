const { Sequelize } = require('sequelize');

const _Roles = require('./roles');
const _Users = require('./users');
const _Posts = require('./posts');
const _Comments = require('./comments');
const _Categories = require('./categories');
const _LikedComments = require('./liked_comments');
const _LikedPosts = require('./liked_posts');
const _PostsCategories = require('./posts_categories');
const _UnconfirmedData = require('./unconfirmed_data');

require('dotenv').config();

const sequelize = new Sequelize({
  logging: false,
  dialect: 'postgres',
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

console.log('DB is connected');

const Roles = _Roles(sequelize);
const Users = _Users(sequelize);
const Posts = _Posts(sequelize);
const Comments = _Comments(sequelize);
const Categories = _Categories(sequelize);
const LikedComments = _LikedComments(sequelize);
const LikedPosts = _LikedPosts(sequelize);
const PostsCategories = _PostsCategories(sequelize);
const UnconfirmedData = _UnconfirmedData(sequelize);


Comments.belongsTo(Comments, { as: 'ref_sub_comment', foreignKey: 'ref_sub' });
Comments.hasMany(Comments, { as: 'comments', foreignKey: 'ref_sub' });
LikedComments.belongsTo(Comments, { as: 'comment', foreignKey: 'comment_id' });
Comments.hasMany(LikedComments, { as: 'liked_comments', foreignKey: 'comment_id' });
Comments.belongsTo(Posts, { as: 'ref_post', foreignKey: 'ref' });
Posts.hasMany(Comments, { as: 'comments', foreignKey: 'ref' });
LikedPosts.belongsTo(Posts, { as: 'post', foreignKey: 'post_id' });
Posts.hasMany(LikedPosts, { as: 'liked_posts', foreignKey: 'post_id' });
PostsCategories.belongsTo(Posts, { as: 'post', foreignKey: 'post_id' });
Posts.hasMany(PostsCategories, { as: 'posts_categories', foreignKey: 'post_id' });
Users.belongsTo(Roles, { as: 'role', foreignKey: 'role_id' });
Roles.hasMany(Users, { as: 'users', foreignKey: 'role_id' });
PostsCategories.belongsTo(Categories, { as: 'category', foreignKey: 'category_id' });
Categories.hasMany(PostsCategories, { as: 'posts_categories', foreignKey: 'category_id' });
Comments.belongsTo(Users, { as: 'originator', foreignKey: 'originator_id' });
Users.hasMany(Comments, { as: 'comments', foreignKey: 'originator_id' });
LikedComments.belongsTo(Users, { as: 'originator', foreignKey: 'originator_id' });
Users.hasMany(LikedComments, { as: 'liked_comments', foreignKey: 'originator_id' });
LikedPosts.belongsTo(Users, { as: 'originator', foreignKey: 'originator_id' });
Users.hasMany(LikedPosts, { as: 'liked_posts', foreignKey: 'originator_id' });
UnconfirmedData.belongsTo(Users, { as: 'user', foreignKey: 'user_id' });
Users.hasMany(UnconfirmedData, { as: 'unconfirmed_data', foreignKey: 'user_id' });
Posts.belongsTo(Users, { as: 'originator', foreignKey: 'originator_id' });
Users.hasMany(Posts, { as: 'user_posts', foreignKey: 'originator_id' });

(async () => {
  for (const m of Object.values(sequelize.models)) {
    await m.sync({ alter: true });
    console.log(m, 'done');
  }
})();

module.exports = {
  sequelize,
  ...sequelize.models,
};
