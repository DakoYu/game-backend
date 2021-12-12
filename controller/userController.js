const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const User = require('../models/userSchema');
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

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/img/users/${req.file.filename}`);

    next();
});

exports. getUser = catchAsync(async(req, res, next) => {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
        return next(new AppError('Invalid user', 400));
    }

    res.status(200).json({
        status: 'success',
        user
    })
})

exports. getAllUser = catchAsync(async(req, res) => {
    const user = await User.find();

    res.status(200).json({
        status: 'success',
        user
    });
})

exports. getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports. updateMe = catchAsync(async(req, res, next) => {
    const filteredBody = {
        name: req.body.name
    };
    console.log(req.body)
    if(req.file) filteredBody.image = req.file.filename;

    const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        user
    })
});

exports. userImage = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.params.id);

    res.sendFile(path.join(__dirname, '../public/img/users', user.image))
});
