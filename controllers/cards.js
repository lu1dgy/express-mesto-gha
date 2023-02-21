const Card = require('../models/card');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки.'
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки.'
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const cardId = req.params.cardId;
  Card.findByIdAndDelete(cardId)
    .then(() => {
      res.status(200).send({ message: 'Card deleted' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new NotFoundError(`Карточка с указанным id=${cardId} не найдена.`)
        );
      } else {
        next(err);
      }
    });
};

module.exports.addCardLike = (req, res, next) => {
  const cardId = req.params.cardId;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError(`Передан несуществующий id=${cardId} карточки`));
      } else if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные для постановки лайка.'
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.removeCardLike = (req, res, next) => {
  const cardId = req.params.cardId;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError(`Передан несуществующий id=${cardId} карточки`));
      } else if (err.name === 'ValidationError') {
        next(
          new BadRequestError('Переданы некорректные данные для снятия лайка.')
        );
      } else {
        next(err);
      }
    });
};
