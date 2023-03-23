const cors = require('cors');

const DEFAULT_ALLOWED_METHODS = 'GET,PUT,PATCH,POST,DELETE,HEAD';

const allowedCors = [
  'http://localhost:3000',
  'localhost:3000',
  'https://localhost:3000',
  'http://mesto.lapkes.nomoredomains.work',
  'https://mesto.lapkes.nomoredomains.work',
  'mesto.lapkes.nomoredomains.work',
];

const corsOptions = {
  origin: allowedCors,
  credentials: true,
  methods: DEFAULT_ALLOWED_METHODS,
  allowedHeaders: 'Content-Type,Authorization',
};

module.exports = cors(corsOptions);
