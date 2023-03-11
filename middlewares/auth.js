const jwt = require('jsonwebtoken');
const { SECRET_JWT } = require('../utils/constants');
const { UnauthorizedError } = require('../utils/errors/UnauthorizedError');

const extractBearerToken = (header) => header.replace('Bearer ', '');
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Нужно авторизоваться'));
  }
  const token = extractBearerToken(authorization);
  let userId;
  try {
    userId = jwt.verify(token, SECRET_JWT);
  } catch (err) {
    return next(new UnauthorizedError('Нужно авторизоваться'));
  }
  req.user = userId; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
