class ServerError extends Error {
  constructor(...args) {
    super(...args);
    this.Unknown();
  }

  Internal() {
    this.code = 500;
    return this;
  }

  Timeout() {
    this.code = 504;
    return this;
  }

  Unknown() {
    this.code = 520;
    return this;
  }
}

module.exports = ServerError;