var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');

router.post('/login', authController.googleLogin);

module.exports = router;
