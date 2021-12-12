const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const userController = require('../controller/userController');

router.route('/register').post(authController.regiser);
router.route('/login').post(authController.login);
router.route('/image/:id').get(userController.userImage);

// Protect Routes
router.use(authController.protect);
router.route('/all').get(authController.restrictTo('admin'), userController.getAllUser);
router.route('/getme').get(userController.getMe, userController.getUser);
router.route('/updateme').patch(userController.getMe, userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);
router.route('/resetpassword').patch(userController.getMe, authController.resetPassword);

module.exports = router;