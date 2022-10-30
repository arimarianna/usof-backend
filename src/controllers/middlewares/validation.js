const Joi = require('joi');
const { ClientError } = require('../../errors');

class Validation {
  handle = (key, schema) => async (req, res, next) => {
    try {
      const data = req[key];

      const result = await this._validate(schema, data);

      req[key] = result;

      next();
    } catch (err) {
      next(new ClientError(err.message).BadRequest());
    }
  };

  _validate = (schema, data) => schema.validateAsync(data);

  loginBody = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required(),
  });

  registerBody = Joi.object({
    login: Joi.string().required().min(3),
    password: Joi.string().required().min(6),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
  });

  passwordResetBody = Joi.object({
    email: Joi.string().email().required(),
  });

  passwordResetConfirmBody = Joi.object({
    password: Joi.string().required().min(6),
  });

  categoryBody = Joi.object({
    title: Joi.string().required().min(2),
    description: Joi.string().allow('').optional(),
  });

  usersData = Joi.object({
    name: Joi.string().optional().min(2),
    email: Joi.string().email().optional(),
    role_id: Joi.number().optional(),
  });

  userDataCreate = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().email().required(),
    role_id: Joi.number().required(),
    login: Joi.string().required().min(3),
  });

  commentData = Joi.object({
    content: Joi.string().required().min(1),
  });

  postData = Joi.object({
    title: Joi.string().required().min(2),
    content: Joi.string().required().min(1),
    categories: Joi.array().items(Joi.number()).optional(),
  });

  filterPost = Joi.object({
    page: Joi.number().optional(),
    sort: Joi.string().valid('ASC', 'DESC').optional(),
    filter: Joi.string().optional(),
  });
}

module.exports = new Validation();