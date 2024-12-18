const express = require('express');
const router = express.Router();

const token = require('../utils/jwt');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
});

module.exports = router;
