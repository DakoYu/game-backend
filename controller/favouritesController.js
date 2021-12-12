const Favourite = require('../models/favouriteSchema');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports. addMyGame = catchAsync(async(req, res, next) => {
    const user = req.user._id;

    const { game } = req.body;

    const mygame = await Favourite.create({
        user, 
        game
    });

    res.status(200).json({
        status: 'success',
        mygame
    })
});

exports. getMyGame = catchAsync(async(req, res, next) => {
    const mygame = await Favourite.find({ user: req.user._id });

    res.status(200).json({
        status: 'success',
        results: mygame.length,
        mygame
    });
});

exports. deleteMyGame = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    await Favourite.findByIdAndDelete(id);

    res.status(200).json({
        status: 'success'
    })
});