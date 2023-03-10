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

router.get('/cards', getCards);
router.post('/cards', cardValidator, createCard);
router.delete('/cards/:cardId', cardIdValidator, deleteCard);
router.put('/cards/:cardId/likes', cardIdValidator, addCardLike);
router.delete('/cards/:cardId/likes', cardIdValidator, removeCardLike);

module.exports = router;
