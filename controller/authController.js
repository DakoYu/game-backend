const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError =require('../utils/AppError');

const createToken = (user, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({
        status: 'success',
        token,
        user
    });
}

exports. regiser = catchAsync(async(req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        return next(new AppError('Email is taken', 400));
    }

    const newUser = await User.create({
        name,
        email,
        password,
        passwordConfirm
    });

    createToken(newUser, res);
});

exports. login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please Provide Email or Password', 400));
    }

    const user = await User.findOne({ email }).select('password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Invalid Email or Password', 401));
    }

    createToken(user, res);
});

exports. protect = catchAsync(async(req, res, next) => {
    let token;
    
    const {
        headers: {authorization}
    } = req;

    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
        return next(new AppError('Invalid user', 401))
    }
    
    req.user = user;

    next();
});

exports. restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.roles)) {
            return next(new AppError('You do not have the permission to perform this action', 403));
        }

        next();
    }
}

exports. resetPassword = catchAsync(async(req, res, next) => {
    const { currentPassword, newPassword, passwordConfirm } = req.body;

    if (!currentPassword || !newPassword || !passwordConfirm) return next (new AppError('Please provide passwords', 400));

    const user = await User.findById(req.user.id).select('+password');

    if (!user) return next(new AppError('Invalid user', 400));

    if (!await(user.correctPassword(currentPassword, user.password))) return next(new AppError('Your current password is wrong', 401));

    user.password = newPassword;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    createToken(user, res);
});