const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Users, UnconfirmedData } = require('../../models');
const { ClientError } = require('../../errors');
const Mailer = require('../mailer');
const Tokens = require('./tokens');

class Auth {
  login = async ({ login, password }) => {
    let user = await Users.findByLogin(login);

    if (!user) {
      throw new ClientError('User is not found').BadRequest();
    }

    const isUnconfirmed = await UnconfirmedData.findByUserId(user.id);

    if (isUnconfirmed) {
      throw new ClientError('Login is forbidden. Confirm your email.').Forbidden();
    }

    const isMatch = await this._comparePass(password, user.password);

    if (!isMatch) {
      throw new ClientError('The password doesn\'t match. Try another.').Forbidden();
    }

    delete user.password;
    const tokens = await Tokens.generateTokens(user);

    return { user, tokens };
  };

  async resetPassword(email) {
    const user = await Users.findByEmail(email);

    if (!user) {
      throw new ClientError('User is not found').BadRequest();
    }

    const key = this._generateKey();

    try {
      await UnconfirmedData.create({
        user_id: user.id,
        isRegister: false,
        key,
      });
    } catch (err) {
      new ClientError('You are not confirm your email or you are already try to reset password').Conflict();
    }

    Mailer.sendResetPassword(email, key);

    return { message: `Password reset instructions sent to the email ${email} successfully` };
  }

  async confirmResetPassword(key, password) {
    const unconfirmed = await UnconfirmedData.findByKey(key);

    if (!unconfirmed || unconfirmed.isRegister) {
      throw new ClientError('Token is not valid').BadRequest();
    }

    await UnconfirmedData.destroy({ where: { user_id: unconfirmed.user_id } });

    password = await this._hashPassword(password);

    await Users.update({
      password,
    }, {
      where: {
        id: unconfirmed.user_id,
      },
    }); 

    return { message: 'Password update successfully.' };
  }

  register = async (user) => {
    user.password = await this._hashPassword(user.password);
    const key = this._generateKey();
    let email;

    try { 
      user.role_id = 1;
      user = await Users.create(user);

      email = user.email;

      await UnconfirmedData.create({
        key,
        user_id: user.id,
        isRegister: true,
      });
    } catch (err) {
      new ClientError('You are already register').Conflict();
    }

    await Mailer.sendRegistrationConfirm(email, key);

    return { message: `User ${user.login} successfully created!` };
  };

  confirmRegistration = async (key) => {
    const result = await UnconfirmedData.destroy({ where: { key, isRegister: true } });

    if (!result) {
      throw new ClientError('Token is not valid').BadRequest();
    }

    return { message: 'Registration successfully confirmed!' };
  };

  _hashPassword = (password) => bcrypt.hash(password, 10);

  _generateKey = () => crypto.randomBytes(16).toString('hex');

  _comparePass = (password, passwordFromDb) => bcrypt.compare(password, passwordFromDb);
}

module.exports = new Auth();