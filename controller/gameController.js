const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const Game = require('../models/gameSchema');
const Favourite = require('../models/favouriteSchema');
const catchAsync = require('../utils/catchAsync');
const AppError =require('../utils/AppError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb)=>{
    if (file.mimetype.startsWith('image')){
        cb(null, true)
    } else{
        cb(new AppError('Not an image! Please upload only images', 400), false)
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports. uploadUserPhoto = upload.single('photo');
 
exports. resizeUserPhoto = catchAsync(async(req, res, next)=>{
    if (!req.file) return next();

    req.file.filename = `game-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
    .resize(768, 768)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/img/games/${req.file.filename}`);

    next();
});

exports. getAll = catchAsync(async(req, res) => {
    const games = await Game.find();

    res.status(200).json({
        status: 'success',
        results: games.length,
        games
    });
});

exports. getOne = catchAsync(async(req, res, next) => {
    const game = await Game.findById(req.params.id);

    if (!game) return next(new AppError('Invalid Game', 400));

    res.status(200).json({
        status: 'success',
        game
    })
});

exports. createOne = catchAsync(async(req, res, next) => {
    const filteredObj = {
        name: req.body.name,
        year: req.body.year,
        price: req.body.price
    }

    if (req.file) filteredObj.image = req.file.filename;

    const newGame = await Game.create(filteredObj);

    res.status(200).json({
        status: 'success',
        game: newGame
    })
});

exports. deleteOne = catchAsync(async(req, res, next) => {
    const game = await Game.findByIdAndDelete(req.params.id);

    if (!game) return next(new AppError('No game found with that ID', 404));

    const collection = await Favourite.deleteMany({ game: req.params.id });

    res.status(200).json({
        status: 'success'
    })
});

exports. updateOne = catchAsync(async(req, res, next) => {
    const filteredBody = {
        name: req.body.name,
        year: req.body.year
    };

    if(req.file) filteredBody.image = req.file.filename;

    const game = await Game.findByIdAndUpdate(req.params.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        game
    })
});

exports. gameImage = catchAsync(async(req, res, next) => {
    const game = await Game.findById(req.params.id);

    res.sendFile(path.join(__dirname, '../public/img/games', game.image))
});
