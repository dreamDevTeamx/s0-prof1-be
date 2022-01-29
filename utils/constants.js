require('dotenv').config();

const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const COOKIE_KEY = 'dreamDevTeamx';

const COOKIE_OPTIONS = {
  maxAge: 3600000 * 24 * 7,
  httpOnly: true,
};

const {
  PORT = 3005,
  MONGO_URL = 'mongodb://localhost:27017/dreamDevTeamx',
  NODE_ENV,
  JWT_SECRET,
} = process.env;

const SECRET_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'dev-key';

module.exports = {
  PORT,
  MONGO_URL,
  MONGO_OPTIONS,
  SECRET_KEY,
  COOKIE_KEY,
  COOKIE_OPTIONS,
};
