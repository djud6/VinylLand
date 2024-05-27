const express = require('express');
const offerRoutes = require('./offerRoutes')
const controller = require('../controllers/vinylController');
const offerController = require('../controllers/offerController');
const {isLoggedIn, isSeller, isNotSeller} = require('../middlewares/auth');
const{isInValid} = require('../middlewares/auth');
const router = express.Router();







module.exports = router;
