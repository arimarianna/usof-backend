const { Router } = require('express');
const auth = require('./auth');
const users = require('./users');
const posts = require('./posts');
const categories = require('./categories');
const comments = require('./comments');

const { Perm } = require('../controllers/middlewares');

const router = Router();

router.use('/auth/', auth);
router.use('/users/', users);
router.use('/posts/', posts);
router.use('/categories/', categories);
router.use('/comments/', comments);

router.get('/', Perm.construct(), (req, res) => {
  res.send('Welcome to usof, bro!');
});

module.exports = router;