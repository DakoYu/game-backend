const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const gameController = require('../controller/gameController');

router.route('/').get(gameController.getAll);
router.route('/:id').get(gameController.getOne);
router.route('/image/:id').get(gameController.gameImage);

// Admin Only
router.use(authController.protect, authController.restrictTo('admin'));
router.route('/delete/:id').delete(gameController.deleteOne);

// Check image file
router.use(gameController.uploadUserPhoto, gameController.resizeUserPhoto);
router.route('/create').post(gameController.createOne);
router.route('/update/:id').patch(gameController.updateOne);
module.exports = router;