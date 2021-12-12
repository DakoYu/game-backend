const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const userController = require('../controller/userController');
const favouriteController = require('../controller/favouritesController');

router.use(authController.protect);
router.route('/')
.get(favouriteController.getMyGame)
.post(favouriteController.addMyGame);

router.route('/:id')
.delete(favouriteController.deleteMyGame);

module.exports = router;