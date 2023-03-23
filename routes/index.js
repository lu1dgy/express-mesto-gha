const express = require('express');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { logout, login, createUser } = require('../controllers/users');
const { loginValidator, registrationValidator } = require('../utils/validators/usersValidator');

const router = express.Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.get('/signout', logout);
router.post('/signin', loginValidator, login);
router.post('/signup', registrationValidator, createUser);
router.use('*', (req, res, next) => next(new NotFoundError('Этот адрес не найден. Путь неправильный')));

module.exports = router;
