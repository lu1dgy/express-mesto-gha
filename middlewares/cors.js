const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:3000', 'localhost:3000', 'https://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
