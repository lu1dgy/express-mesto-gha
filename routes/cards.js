const express = require('express');
const {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  removeCardLike,
} = require('../controllers/cards');
const { cardValidator, cardIdValidator } = require('../utils/validators/cardValidator');

const router = express.Router();

router.get('/', getCards);
router.post('/', cardValidator, createCard);
router.delete('/:cardId', cardIdValidator, deleteCard);
router.put('/:cardId/likes', cardIdValidator, addCardLike);
router.delete('/:cardId/likes', cardIdValidator, removeCardLike);

module.exports = router;
