const jwt = require('jsonwebtoken');
const { SECRET_JWT } = require('../utils/constants');
const { UnauthorizedError } = require('../utils/errors/UnauthorizedError');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Нужно авторизоваться');
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, SECRET_JWT);
  } catch (err) {
    return next(new UnauthorizedError('Нужно авторизоваться'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
