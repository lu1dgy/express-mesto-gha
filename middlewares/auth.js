const token = require('jsonwebtoken');

const { SECRET_JWT, NODE_ENV } = process.env;
const { UnauthorizedError } = require('../utils/errors/UnauthorizedError');

module.exports = (req, _, next) => {
  const { jwt } = req.cookies;
  if (!token) {
    return next(new UnauthorizedError('Нужно авторизоваться'));
  }
  let payload;
  try {
    payload = token.verify(jwt, NODE_ENV === 'production' ? SECRET_JWT : 'test');
  } catch (err) {
    return next(new UnauthorizedError('Нужно авторизоваться'));
  }
  req.user = { _id: payload._id }; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
