const express = require('express');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { NotFoundError } = require('../utils/errors/NotFoundError');

const router = express.Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res, next) => next(new NotFoundError('Этот адрес не найден. Путь неправильный')));

module.exports = router;
