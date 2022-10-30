const { LikedPosts, Comments, Posts, PostsCategories } = require('../../models');
const { Sequelize } = require('sequelize');
const { ClientError } = require('../../errors');

class Post {
  create = async (data, originator) => {
    const { id } = await Posts.create({
      ...data,
      originator_id: originator.id,
    });

    if (data.categories) {
      const categoryPayload = data.categories.map((category_id) => ({ category_id, post_id: id }));
      await PostsCategories.bulkCreate(categoryPayload);
    }


    return { message: 'Posts successfully created' };
  };

  async getSpecific(post_id) {
    const result = await Posts.findOneWithOriginator(post_id);

    if (!result) {
      throw new ClientError('Post is not found').BadRequest();
    }

    return result;
  }

  get = async (page = 1, filter = '', sort = 'ASC') => {
    const [category, date] = filter.split('||');

    filter = {};

    if (category) {
      filter.category = category;
    }

    if (date) {
      try {
        let [start, end] = date.split('--');

        start = new Date(start).toISOString();
        end = new Date(end).toISOString();

        filter.date = { start, end };
      } catch (err) {
        throw new ClientError('Invalid date').BadRequest();
      }
    }

    const result = await Posts.findAllWithOriginator(page, filter, sort);

    return result;
  };


  delete = async (post_id, originator) => {
    const where = { id: post_id };

    if (originator.urole !== 'admin') {
      where.originator_id = originator.id;
    }

    const result = await Posts.destroy({
      where,
    });

    if (!result) {
      throw new ClientError('Posts is not exist').BadRequest();
    }

    return { message: 'Posts successfully deleted' };
  };

  // data = title, content or category 
  // joi body : title , content, category [] -> optional, but cant with zero size
  update = async (post_id, data, originator) => {
    const { categories, ...update } = data;

    const [result] = await Posts.update(update, {
      where: {
        originator_id: originator.id,
        id: post_id,
      },
    });

    if (!result) {
      throw new ClientError('Post is not exist').BadRequest();
    }

    if (categories) {
      const categoryPayload = categories.map((category_id) => ({ category_id, post_id: post_id }));
      await PostsCategories.destroy({
        where: { post_id: post_id },
      });
      await PostsCategories.bulkCreate(categoryPayload);
    }

    return { message: 'Post successfully updated' };
  };

  getAllCategories(post_id) {
    return PostsCategories.findByPostId(post_id);
  }

  createComment = async (post_id, data, originator) => {
    const result = {
      ...data,
      ref: post_id,
      originator_id: originator.id,
    };

    await Comments.create(result);

    return { message: 'Comments successfully created' };
  };

  addLike = async (post_id, { id }) => {
    try {
      await LikedPosts.create({ post_id, originator_id: id });

      return { message: 'Like successfully added' };
    } catch (err) {
      if (err instanceof Sequelize.UniqueConstraintError) {
        throw new ClientError('This like already exist').Conflict();
      }

      if (err instanceof Sequelize.ForeignKeyConstraintError) {
        throw new ClientError('Post is not exist').Conflict();
      }

      throw err;
    }
  };

  deleteLike = async (post_id, originator) => {
    const result = await LikedPosts.destroy({
      where: {
        post_id,
        originator_id: originator.id,
      },
    });

    if (!result) {
      throw new ClientError('Like is not exist').BadRequest();
    }

    return { message: 'Like successfully deleted' };
  };

  getComments(id) {
    return Comments.getForPost(id);
  }

  getAllLikes = async (id) => {
    const result = await Posts.findPostWithLikes(id);

    if (!result) {
      throw new ClientError('Posts is not exist').BadRequest();
    }

    const { liked_posts } = result;

    return liked_posts;
  };
}

module.exports = new Post();