const { ClientError } = require('../../errors');
const { Users } = require('../../models');
const Token = require('./token');

class Tokens {
  constructor() {
    this._accessToken = new Token(process.env.TOKEN_ACCESS, '30m', 30 * 60 * 1000);
    this._refreshToken = new Token(process.env.TOKEN_REFRESH, '2d', 2 * 24 * 60 * 60 * 1000);
  }

  generateTokens = async (data) => {
    const access = await this._accessToken.create(data);
    const refresh = await this._refreshToken.create({ login: data.login });

    return { access, refresh };
  };

  updateTokens = (res, { access, refresh }) => {
    this._setToken(res, 'access', access.token, access.expire);
    this._setToken(res, 'refresh', refresh.token, refresh.expire);
  };

  clearTokens = (res) => {
    this._setToken(res, 'access', '', 1);
    this._setToken(res, 'refresh', '', 1);
  };

  validateTokens = async (access, refresh, res) => {
    try {
      return this._accessToken.verify(access);
    } catch (err) {
      const data = this._refreshToken.verify(refresh);

      const user = await Users.findByLogin(data.login, true);

      if (!user) {
        throw new ClientError('User is not active').Unauthorized();
      }

      if (res) {
        this.updateTokens(res, await this.generateTokens(user));
      }

      return user;
    }
  };

  getTokensFromReq = (req) => {
    const access = req.cookies.access;
    const refresh = req.cookies.refresh;

    return { access, refresh };
  };

  _setToken(res, key, token, expire) {
    res.cookie(key, token, {
      maxAge: expire,
      httpOnly: false,
    });
  }
}

module.exports = new Tokens();