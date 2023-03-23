const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

const { NotFoundError } = require('../utils/errors/NotFoundError');
const { BadRequestError } = require('../utils/errors/BadRequestError');
const { ConflictError } = require('../utils/errors/ConflictError');

const { SECRET_JWT, NODE_ENV } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь по указанному id=${userId} не найден. `);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
module.exports.getMyself = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.checkUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? SECRET_JWT : 'test', {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 10,
          secure: NODE_ENV === 'production',
          sameSite: true,
          httpOnly: true,
        })
        .send({ message: 'Вы успешно вошли' });
    })
    .catch((e) => {
      next(e);
    });
};

module.exports.logout = (req, res, next) => {
  res
    .clearCookie('jwt')
    .send({ message: 'Успешный выход' })
    .catch((err) => {
      next(err);
    });
};

const updateUser = (res, next, userId, update) => {
  User.findByIdAndUpdate(userId, update, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь по указанному id=${userId} не найден. `);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  const update = { name, about };
  updateUser(res, next, userId, update);
};
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  const update = { avatar };
  updateUser(res, next, userId, update);
};

module.exports.updateProfile = updateUserProfile;
module.exports.updateAvatar = updateUserAvatar;
