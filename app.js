const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const rootRouter = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { loginValidator, registrationValidator } = require('./utils/validators/usersValidator');

const { PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(requestLogger);
app.use(cors);

mongoose
  .connect(DB_ADDRESS)
  .then(() => console.log('Соединение с базой данных установлено'))
  .catch((err) => {
    console.log(`Ошибка при подключении к базе данных: ${err.message}`);
  });

app.post('/signin', loginValidator, login);
app.post('/signup', registrationValidator, createUser);
// Обработчики роутов для пользователей

app.use(auth);
app.use(rootRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
