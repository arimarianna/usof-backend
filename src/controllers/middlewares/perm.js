const { ClientError } = require('../../errors');
const Tokens = require('../auth/tokens');

class Perm {
  construct = (adminOnly) => async (req, res, next) => {
    try {
      const { access, refresh } = Tokens.getTokensFromReq(req);

      const originator = await Tokens.validateTokens(access, refresh, res);

      req.originator = originator;

      if (adminOnly && originator.urole !== 'admin') {
        throw new ClientError('This endpoint not for you.').Unauthorized();
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new Perm();