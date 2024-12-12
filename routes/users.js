var express = require('express');
var router = express.Router();
/**
* @swagger
*   /users:
*     get:
*       description: "users API"
*       responses:
*         200:
*           description: "success"
*           content:
*             application/json:
*               schema:
*                 type: string
*                 example: "Hello world"
*/

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hello world');
});

const authController = require('../controllers/authController');
router.post('/login', authController.googleLogin);
router.po
module.exports = router;
