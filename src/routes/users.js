const { Router } = require('express');
const { Perm, Validation } = require('../controllers/middlewares');
const path = require('path');
const multer = require('multer');
const { ClientError } = require('../errors');
const Users = require('../controllers/users');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'storage', 'avatars'),
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes('image')) {
      return cb(new ClientError('Wrong file type').BadRequest());
    }
    cb(null, true);
  },
});

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await Users.get();
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:user_id', async (req, res, next) => {
  try {
    const result = await Users.getSpecific(req.params.user_id);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

/*
  create a new user,
  required parameters are [login, password, password confirmation, email, role].
  This feature must be accessible only for admins */
router.post('/', Validation.handle('body', Validation.userDataCreate), Perm.construct(true), async (req, res, next) => {
  try {
    const result = await Users.create(req.body);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.patch('/avatar', Perm.construct(), upload.single('avatar'), async (req, res, next) => {
  try {
    const result = await Users.updateAvatar(req.file.filename, req.originator);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.patch('/:user_id', Validation.handle('body', Validation.userData), Perm.construct(), async (req, res, next) => {
  try {
    const result = await Users.update(req.body, req.params.user_id, req.originator);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/:user_id', Perm.construct(), async (req, res, next) => {
  try {
    const result = await Users.delete(req.params.user_id, req.originator);
    res.send(result);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
