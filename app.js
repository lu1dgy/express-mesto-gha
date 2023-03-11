const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const rootRouter = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { loginValidator, registrationValidator } = require('./utils/validators/usersValidator');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cookieParser());
app.use(express.json());

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Соединение с базой данных установлено'))
  .catch((err) => {
    console.log(`Ошибка при подключении к базе данных: ${err.message}`);
  });

app.post('/signin', loginValidator, login);
app.post('/signup', registrationValidator, createUser);
// Обработчики роутов для пользователей

app.use(auth);
app.use(rootRouter);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server started on port 3000');
});
