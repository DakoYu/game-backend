const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();

const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const favouriteRoutes = require('./routes/favoruiteRoutes');
const errorController = require('./controller/errorController');
const AppError = require('./utils/AppError');

app.use(cors());
app.use(helmet());

app.use(express.urlencoded({ extended:true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());

app.use(xss());

app.use(hpp());

app.use('/api/user', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/mygame', favouriteRoutes);

app.use('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
