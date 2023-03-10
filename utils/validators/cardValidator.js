const { Joi, celebrate } = require('celebrate');
const { AVATAR_URL_REGEX } = require('../constants');

module.exports.cardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(AVATAR_URL_REGEX),
  }),
});

module.exports.cardIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
});
