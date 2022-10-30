const { Router } = require('express');

const Posts = require('../controllers/post');
const { Perm, Validation } = require('../controllers/middlewares');

const router = Router();

// This endpoint doesn't require any role, it is public
router.get('/', Validation.handle('query', Validation.filterPost), async (req, res, next) => {
  try {
    const result = await Posts.get(req.query.page, req.query.filter, req.query.sort);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

// Endpoint is public
router.get('/:post_id', async (req, res, next) => {
  try {
    const result = await Posts.getSpecific(req.params.post_id);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

// Endpoint is public
router.get('/:post_id/comments', async (req, res, next) => {
  try {
    const result = await Posts.getComments(req.params.post_id);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.post('/:post_id/comments', Validation.handle('body', Validation.commentData), Perm.construct(), async (req, res, next) => {
  try {
    const result = await Posts.createComment(req.params.post_id, req.body, req.originator);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:post_id/categories', async (req, res, next) => {
  try {
    const result = await Posts.getAllCategories(req.params.post_id);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:post_id/like', async (req, res, next) => {
  try {
    const result = await Posts.getAllLikes(req.params.post_id);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.post('/', Validation.handle('body', Validation.postData), Perm.construct(), async (req, res, next) => {
  try {
    const message = await Posts.create(req.body, req.originator);
    res.send(message);
  } catch (err) {
    next(err);
  }
});

router.post('/:post_id/like', Perm.construct(), async (req, res, next) => {
  try {
    const result = await Posts.addLike(req.params.post_id, req.originator);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

/*
  update the specified post (its title, body or category).
  It's accessible only for the creator of the post */
router.patch('/:post_id', Validation.handle('body', Validation.postData), Perm.construct(), async (req, res, next) => {
  try {
    const result = await Posts.update(req.params.post_id, req.body, req.originator);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/:post_id', Perm.construct(), async (req, res, next) => {
  try {
    const id = req.params.post_id;
    const result = await Posts.delete(id, req.originator);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/:post_id/like', Perm.construct(), async (req, res, next) => {
  try {
    const result = await Posts.deleteLike(req.params.post_id, req.originator);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
