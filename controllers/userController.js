const jwtUtil = require('../utils/jwt'); 
const userStore = require('../store/userStore');
const errorMessage = require('../utils/errorMessage'); 

exports.getMyProfile = async (req, res) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return errorMessage(res, 401); 
    }

    const tokenValue = token.split(' ')[1];
    if (!tokenValue) {
      return errorMessage(res, 401); 
    }

    const authorization = jwtUtil.verifyToken(tokenValue);
    if (!authorization || !authorization.id) {
      return errorMessage(res, 401); 
    }

    const userId = authorization.id;

    const user = await userStore.findById(userId);
    if (!user) {
      return errorMessage(res, 404); 
    }

    return res.status(200).json(user); 

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return errorMessage(res, 500); 
  }
};