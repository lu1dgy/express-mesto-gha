const Card = require('../models/card');
const { BadRequestError } = require('../utils/errors/BadRequestError');
const { ForbiddenError } = require('../utils/errors/ForbiddenError');
const { NotFoundError } = require('../utils/errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным id=${cardId} не найдена.`);
      }
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Вы не можете удалить эту карточку, она чужая');
      }
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
      } else {
        next(err);
      }
    });
};

module.exports.addCardLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным id=${cardId} не найдена.`);
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
      } else {
        next(err);
      }
    });
};

module.exports.removeCardLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным id=${cardId} не найдена.`);
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
      } else {
        next(err);
      }
    });
};
