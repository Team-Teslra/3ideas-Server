const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
require('dotenv').config();

const userRouter = require('./routes/user');
const askRouter = require('./routes/ask');
const asksRouter = require('./routes/asks');
const answerRouter = require('./routes/answer');
const answersRouter = require('./routes/answers');
const likeRouter = require('./routes/like');
const categoryRouter = require('./routes/category');
const searchRouter = require('./routes/search');

const app = express();
const port = 5000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: process.env.NODE_ENV ? process.env.PROD_CORS_ORIGIN : 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
  }),
);

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.status(200).json('Success');
});

app.use('/user', userRouter);
app.use('/ask', askRouter);
app.use('/asks', asksRouter);
app.use('/answer', answerRouter);
app.use('/answers', answersRouter);
app.use('/like', likeRouter);
app.use('/category', categoryRouter);
app.use('/search', searchRouter);

app.set('port', port);
app.listen(app.get('port'), () => {
  console.log(`app is listening in PORT ${app.get('port')}`);
});

module.exports = app;
