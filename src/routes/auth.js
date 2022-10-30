const { Router } = require('express');
const { Auth } = require('../controllers/auth');
const Tokens = require('../controllers/auth/tokens');
const { Validation } = require('../controllers/middlewares');

const router = Router();

/*
  registration of a new user,
  required parameters are [login, password, password confirmation, email] */
router.post('/register', Validation.handle('body', Validation.registerBody), async (req, res, next) => {
  try {
    const result = await Auth.register(req.body);

    res.send(result);
  } catch (err) {
    next(err);
  }
});

/*
  required parameters are [login, email, password].
  Only users with a confirmed email can sign in */
router.post('/login', Validation.handle('body', Validation.loginBody), async (req, res, next) => {
  try {
    const { user, tokens } = await Auth.login(req.body);

    Tokens.updateTokens(res, tokens);

    res.send(user);
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res, next) => {
  try {
    Tokens.clearTokens(res);
    res.send('Bye!');
  } catch (err) {
    next(err);
  }
});

/*
  required parameter is [email] */
router.post('/password-reset', Validation.handle('body', Validation.passwordResetBody), async (req, res, next) => {
  try {
    const result = await Auth.resetPassword(req.body.email);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

/*
  confirm new password with a token from email,
  required parameter is a [new password] */
router.post('/password-reset/:confirm_token', Validation.handle('body', Validation.passwordResetConfirmBody), async (req, res, next) => {
  try {
    const result = await Auth.confirmResetPassword(req.params.confirm_token, req.body.password);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

// CUSTOM 
router.post('/register/confirmed/:token', async (req, res, next) => {
  try {
    const result = await Auth.confirmRegistration(req.params.token);
    res.send(result);
  } catch (err) {
    next(err);
  }
});



module.exports = router;