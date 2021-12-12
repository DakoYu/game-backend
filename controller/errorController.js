const AppError = require('../utils/AppError');

const handleCastError = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const sendError = (err, req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = Object.assign(err);

    if (err.name === 'CastError') {
        error = handleCastError(error);
    }

    sendError(error, req, res);
}