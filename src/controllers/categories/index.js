const { Sequelize } = require('sequelize');
const { ClientError } = require('../../errors');
const { Categories } = require('../../models');

class Catego {
  getAll = () => Categories.findAll();

  getSpecific = async (id) => {
    const result = await Categories.findById(id);

    if (!result) {
      throw new ClientError('Categories is not exist').BadRequest();
    }

    return result;
  };

  create = async (data) => {
    try {
      data.title = data.title.trim().toLowerCase();
      return await Categories.create(data);
    } catch (err) {
      if (err instanceof Sequelize.UniqueConstraintError) {
        throw new ClientError('This title already exist').Conflict();
      }
      
      throw err;
    }     
  };

  patch = async (id, data) => {
    const [result] = await Categories.update(data, { where: { id } });

    if (!result) {
      throw new ClientError('Categories is not exist').BadRequest();
    }

    return { message: 'Category successfully updated' };
  };

  delete = async (id) => {
    const result = await Categories.destroy({ where: { id } });

    if (!result) {
      throw new ClientError('Categories is not exist').BadRequest();
    }

    return { message: 'Category successfully deleted' };
  };
}

module.exports = new Catego();