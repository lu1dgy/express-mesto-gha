const jwt = require('jsonwebtoken');
const { SECRET_JWT } = require('../utils/constants');
const { UnauthorizedError } = require('../utils/errors/UnauthorizedError');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return Promise.reject(new UnauthorizedError('Необходима авторизация'));
  }
  const token = extractBearerToken(authorization);
  jwt
    .verify(token, SECRET_JWT)
    .then((payload) => {
      req.user = payload;
      next();
    })
    .catch(() => Promise.reject(new UnauthorizedError('Необходима авторизация')));
  return 1;
};
