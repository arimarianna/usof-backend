class ClientError extends Error {
  constructor(...args) {
    super(...args);
    this.Teapot();
  }

  BadRequest() {
    this.code = 400;
    return this;
  }

  Unauthorized() {
    this.code = 401;
    return this;
  }

  Forbidden() {
    this.code = 403;
    return this;
  }

  NotFound() {
    this.code = 404;
    return this;
  }

  Conflict() {
    this.code = 409;
    return this;
  }

  PreconditionFailed() {
    this.code = 412;
    return this;
  }

  UnsupportedMediaType() {
    this.code = 415;
    return this;
  }

  ExpectationFailed() {
    this.code = 417;
    return this;
  }

  Teapot() {
    this.code = 418;
    return this;
  }
}

module.exports = ClientError;