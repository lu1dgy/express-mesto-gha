const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NotFoundError } = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Соединение с базой данных установлено'))
  .catch((err) => {
    console.log(`Ошибка при подключении к базе данных: ${err.message}`);
    next(err);
  });

app.use((req, res, next) => {
  req.user = {
    _id: '63f4c50b0c811a7781305230', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

// Обработчики роутов для пользователей
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', () => {
  throw new NotFoundError('Этот адрес не найден. Путь неправильный');
});

app.use((err, req, res, next) => {
  console.error(err);
  const { message, statusCode = 500 } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка на сервере' : message,
  });
  next(err);
});

app.listen(PORT, () => {
  console.log('Server started on port 3000');
});
