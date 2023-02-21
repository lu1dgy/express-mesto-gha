const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => console.log('Соединение с базой данных установлено'))
  .catch((err) => {
    console.log(`Ошибка при подключении к базе данных: ${err.message}`);
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Парсинг данных из тела запроса в формате JSON

// Обработчики роутов для пользователей
app.use('/', userRouter);
app.use('/', cardRouter);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
