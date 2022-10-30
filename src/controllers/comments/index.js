const { Sequelize } = require('sequelize');
const { Comments, LikedComments } = require('../../models');
const { ClientError } = require('../../errors');

class Comm {
  getSpecific = async (id) => {
    const result = await Comments.findById(id);

    if (!result) {
      throw new ClientError('Comments is not exist').BadRequest();
    }

    return result;
  };

  getAllLikes = async (id) => {
    const result = await Comments.findByIdWithLikes(id);

    if (!result) {
      throw new ClientError('Categories is not exist').BadRequest();
    }

    const { liked_comments } = result;

    return liked_comments;
  };

  addLike = async (comment_id, { id }) => {
    try {
      await LikedComments.create({ comment_id, originator_id: id });

      return { message: 'Like successfully added' };
    } catch (err) {
      if (err instanceof Sequelize.UniqueConstraintError) {
        throw new ClientError('This like already exist').Conflict();
      }

      if (err instanceof Sequelize.ForeignKeyConstraintError) {
        throw new ClientError('Comment is not exist').Conflict();
      }

      throw err;
    }
  };

  update = async (id, originator, data) => {
    const [result] = await Comments.update(data, {
      where: {
        id,
        originator_id: originator.id,
      },
    });

    if (!result) {
      throw new ClientError('Comments is not exist').BadRequest();
    }

    return { message: 'Comments successfully updated' };
  };

  delete = async (id, originator) => {
    const where = {
      id,
    };

    if (originator.urole !== 'admin') {
      where.originator_id = originator.id;
    }

    const result = await Comments.destroy({ where });

    if (!result) {
      throw new ClientError('Comments is not exist').BadRequest();
    }

    return { message: 'Comments successfully deleted' };
  };

  deleteLike = async (comment_id, originator) => {
    const result = await LikedComments.destroy({
      where: {
        comment_id,
        originator_id: originator.id,
      }, 
    });

    if (!result) {
      throw new ClientError('Like is not exist').BadRequest();
    }

    return { message: 'Like successfully deleted' };
  };

  createSub = async (comment_id, data, originator) => {
    const result = {
      ...data,
      ref_sub: comment_id,
      originator_id: originator.id,
    };

    await Comments.create(result);

    return { message: 'Comments successfully created' };
  };

  getSub = (id) => Comments.getForSub(id);
}

module.exports = new Comm();