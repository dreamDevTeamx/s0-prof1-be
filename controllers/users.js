const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/not-found-err');
const { CastError } = require('../errors/cast-err');
const { ExistFieldError } = require('../errors/exist-field-err');
const { ValidationError } = require('../errors/validation-err');
const { AuthError } = require('../errors/auth-err');
const {
  SECRET_KEY,
  COOKIE_KEY,
  COOKIE_OPTIONS,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} = require('../utils/constants');

const getUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.send({ data }))
    .catch(next);
};

const signOut = (req, res) => res.clearCookie(COOKIE_KEY).send({ message: 'Куки удалены' });

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ _id: 'admin' }, SECRET_KEY, { expiresIn: '7d' });
    res.cookie(COOKIE_KEY, token, COOKIE_OPTIONS).send({ message: 'Куки установлены' });
  } else {
    next(new AuthError('Неправильные почта или пароль'));
  }
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      }),
    )
    .then((user) => res.send({ data: user.toJSON() }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        return next(new ExistFieldError('Email уже существует'));
      }
      return next(err);
    });
};

const getMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => next(new NotFoundError('Пользователь по указанному _id не найден')))
    .then((user) => res.send({ data: user.toJSON() }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Невалидный id пользователя'));
      }
      return next(err);
    });
};

const updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => next(new NotFoundError('Пользователь по указанному _id не найден')))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Невалидный id пользователя'));
      }
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные для обновления профиля'));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        return next(new ExistFieldError('Email уже существует'));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  login,
  signOut,
  getMe,
  updateProfile,
  getUsers,
};
