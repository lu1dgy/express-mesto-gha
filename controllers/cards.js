const mongoose = require('mongoose');
const Card = require('../models/card');
const { BadRequestError } = require('../utils/errors/BadRequestError');
const { ForbiddenError } = require('../utils/errors/ForbiddenError');
const { NotFoundError } = require('../utils/errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  console.log(req.body);
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным id=${cardId} не найдена.`);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить эту карточку, она чужая');
      }
      return card.remove();
    })
    .then(() => {
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      next(err);
    });
};

const handleCardLike = (action) => (req, res, next) => {
  const { cardId } = req.params;
  const update = action === 'add' ? { $addToSet: { likes: req.user._id } } : { $pull: { likes: req.user._id } };
  const options = { new: true };
  Card.findByIdAndUpdate(cardId, update, options)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным id=${cardId} не найдена.`);
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
      } else {
        next(err);
      }
    });
};

module.exports.addCardLike = handleCardLike('add');
module.exports.removeCardLike = handleCardLike('remove');
