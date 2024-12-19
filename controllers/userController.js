const jwtUtil = require('../utils/jwt'); 
const userStore = require('../store/userStore');
const errorMessage = require('../utils/errorMessage');

const user = {}
// 유저 정보 조회
user.getUsers = async (req, res) => {
  try {
    const { userName, page, pageSize } = req.query;

    const users = await userStore.findByUserName(userName, page, pageSize);

    if (users.length) {
      return res.status(200).json(users);
    } else {
      return errorMessage(res, 404);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return errorMessage(res, 500);
  }
};
// 유저 프로필 조회
user.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return errorMessage(res, 400);

    const user = await userStore.findById([userId]);

    if (user.length) {
      return res.status(200).json(user[0]);
    } else {
      return errorMessage(res, 404);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return errorMessage(res, 500);
  }
};
// 내 프로필 조회
user.getMyProfile = async (req, res) => {
  try {
    const token = req.headers['authorization'];
    if (!token) return errorMessage(res, 401);

    const authorization = jwtUtil.verifyToken(token.split(' ')[1]);

    const user = await userStore.findById([authorization.id]);
    
    if (user.length) {
      return res.status(200).json(user[0]); 
    } else {
      return errorMessage(res, 404); 
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return errorMessage(res, 500); 
  }
};
// 유저 정보 등록

// 유저 정보 수정

module.exports = user;