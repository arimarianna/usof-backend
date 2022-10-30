const { Router } = require('express');
const Comments = require('../controllers/comments');
const { Perm, Validation } = require('../controllers/middlewares');

const router = Router();

router.get('/:comment_id', async (req, res, next) => {
  try {
    const result = await Comments.getSpecific(req.params.comment_id);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:comment_id/like', async (req, res, next) => {
  try {
    const result = await Comments.getAllLikes(req.params.comment_id);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.post('/:comment_id/like', Perm.construct(), async (req, res, next) => {
  try {
    const originator = req.originator;
    
    const result = await Comments.addLike(req.params.comment_id, originator);
    
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.patch('/:comment_id', Validation.handle('body', Validation.commentData), Perm.construct(), async (req, res, next) => {
  try {
    const originator = req.originator;

    const result = await Comments.update(req.params.comment_id, originator, req.body);

    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/:comment_id', Perm.construct(), async (req, res, next) => {
  try {
    const originator = req.originator;

    const result = await Comments.delete(req.params.comment_id, originator);

    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/:comment_id/like', Perm.construct(), async (req, res, next) => {
  try {
    const originator = req.originator;

    const result = await Comments.deleteLike(req.params.comment_id, originator);

    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:comment_id/sub', async (req, res, next) => {
  try {
    const result = await Comments.getSub(req.params.comment_id);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.post('/:comment_id/sub', Validation.handle('body', Validation.commentData), Perm.construct(), async (req, res, next) => {
  try {
    const result = await Comments.createSub(req.params.comment_id, req.body, req.originator);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
