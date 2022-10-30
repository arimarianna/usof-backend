const { ClientError } = require('../../errors');
const { Users, LikedPosts, LikedComments } = require('../../models');
const { Auth } = require('../auth');
const crypto = require('crypto');

class User {
  updateAvatar = (avatar, originator) => {
    const result = Users.update({ avatar }, { where: { id: originator.id } });

    if (!result) {
      throw new ClientError('Failed to upload avatar').BadRequest();
    }

    return { message: 'Avatar successfully update' };
  };

  get = () => Users.findWithRoles();

  getSpecific = async (id) => {
    const user = await Users.findById(id);
    const total = await this.countTotalLikesForUser(id);

    user.totalLikes = total;

    return user;
  };

  update = (data, user_id, originator) => {
    if (user_id !== originator.id && originator.urole !== 'admin') {
      throw new ClientError('You cannot update this user').Forbidden();
    }

    if (originator.urole !== 'admin') {
      delete data.role_id;
    }

    return Users.update(data, { where: { id: originator.id } });
  };

  delete = (user_id, originator) => {
    if (user_id !== originator.id && originator.urole !== 'admin') {
      throw new ClientError('You cannot update this user').Forbidden();
    }

    return Users.destroy({ where: { id: user_id } });
  };

  create = async (data) => {
    data.password = Auth._hashPassword(this._random());

    await Users.create(data);

    return { password: data.password };
  };

  _random = () => crypto.randomBytes(16).toString('hex');

  countTotalLikesForUser = async (id) => {
    const comments = LikedComments.totalForUser(id);
    const posts = LikedPosts.totalForUser(id);

    const result = await Promise.all([comments, posts]);

    return result[0] + result[1];
  };
}

module.exports = new User();