var express = require('express');
var router = express.Router();

/**
* @swagger
*   /:
*     get:
*       description: "default page API"
*       responses:
*         200:
*           description: "success"
*           content:
*             application/json:
*               schema:
*                 type: string
*                 example: "Welcome to Express"
*/
/**

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
