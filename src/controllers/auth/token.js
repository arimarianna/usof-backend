const jwt = require('jsonwebtoken');
const { ClientError } = require('../../errors');

class Token {
  constructor(cert, expiresIn, expiresMs) {
    this.cert = cert;
    this.expiresIn = expiresIn;
    this.expiresMs = expiresMs;
  }

  verify(token) {
    try {
      return jwt.verify(token, this.cert);
    } catch (err) {
      throw new ClientError('Token is invalid').BadRequest();
    }
  }

  async create(data) {
    try {
      const token = await jwt.sign(data || data, this.cert, { expiresIn: this.expiresIn });
      return { token, expire: this.expiresMs };
    } catch (err) {
      throw new ClientError('Error while create token. ').ExpectationFailed();
    }
  }
}

module.exports = Token;
