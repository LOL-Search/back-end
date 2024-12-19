const jwtUtil = require('../utils/jwt'); 
const userStore = require('../store/userStore');
const errorMessage = require('../utils/errorMessage');

const user = {}

user.getMyProfile = async (req, res) => {
  try {
    const token = req.headers['authorization'];
    if (!token) return errorMessage(res, 401);

    const authorization = jwtUtil.verifyToken(token.split(' ')[1]);

    const user = await userStore.findById([authorization.id]);
    
    if (user) {
      return res.status(200).json(user); 
    } else {
      return errorMessage(res, 404); 
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return errorMessage(res, 500); 
  }
};

user.getUsers = async (req, res) => {
  try {
    const { userName, page, pageSize } = req.query;

    const results = await userStore.findByUserName(userName, page, pageSize);

    if (results.length) {
      return res.status(200).json(results);
    } else {
      return errorMessage(res, 404);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return errorMessage(res, 500);
  }
};

user.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return errorMessage(res, 400);

    const result = await userStore.findById([userId]);

    if (result) {
      return res.status(200).json(result);
    } else {
      return errorMessage(res, 404);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return errorMessage(res, 500);
  }
};

module.exports = user;