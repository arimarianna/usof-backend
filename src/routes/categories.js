const { Router } = require('express');
const Categories = require('../controllers/categories');
const { Perm, Validation } = require('../controllers/middlewares');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await Categories.getAll();
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:category_id', async (req, res, next) => {
  try {
    const result = await Categories.getSpecific(req.params.category_id);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

/* 
  create a new category,
  required parameter is [title]*/
router.post('/', Validation.handle('body', Validation.categoryBody), Perm.construct(), async (req, res, next) => {
  try {
    const result = await Categories.create(req.body);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.patch('/:category_id', Validation.handle('body', Validation.categoryBody), Perm.construct(true), async (req, res, next) => {
  try {
    const result = await Categories.patch(req.params.category_id,req.body);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/:category_id', Perm.construct(true), async (req, res, next) => {
  try {
    const result = await Categories.delete(req.params.category_id);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
