const express = require('express');
const router = express.Router();

const token = require('../utils/jwt');

router.get('/', function(req, res, next) {
  const payload = { id: 1 };
  const jwt = token.generateToken(payload);
  res.header('Authorization', jwt).json({ token : jwt });
  // res.render('index', { title: 'Express' })
});

module.exports = router;
