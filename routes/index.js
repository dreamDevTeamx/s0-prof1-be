const router = require('express').Router();
const auth = require('../middlewares/auth');
const { userRouter } = require('./users');
// const { movieRouter } = require('./movies');
const { login, createUser, signOut } = require('../controllers/users');
const { NotFoundError } = require('../errors/not-found-err');
const { validateCreateUser, validationLogin } = require('../middlewares/validations');

router.post('/signin', validationLogin, login);
router.post('/signout', signOut);

router.use('/users', userRouter);

// Чтобы создать пользователя (/signup createUser)
// нужно залогиниться (/signin login)
// с учеткой админа (данные берутся из .env)
router.use(auth);

router.post('/signup', validateCreateUser, createUser);

// router.use('/movies', movieRouter);

router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
