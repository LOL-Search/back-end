const auth = require('../token');
const postStore = require('../store/postStore');

const post = {}

const errorMessage = (res, statusCode) => {
  switch (statusCode) {
    case 400:
      return res.status(400).json({
        errorCode: "BAD_REQUEST",
        message: "요청 파라미터가 잘못되었습니다."
      });
    case 401:
      res.status(401).json({
        "errorCode": "UNAUTHORIZED",
        "message": "회원 인증이 필요합니다."
      });
      case 403:
        return res.state(403).json({
          "errorCode": "FORBIDDEN",
          "message": "수정할 권한이 없습니다."
        });
    case 404:
      return res.status(404).json({
        errorCode: "NOT_FOUND",
        message: "해당 게시물이 없습니다."
      });
    case 500: 
      return res.status(500).json({
        errorCode: "INTERNAL_SERVER_ERROR",
        message: "서버 내부에서 에러가 발생했습니다."
      });
    default:
      break;
  }
}

// 게시판 조회
post.getBoard = async (req, res) => {
  try {
    const { userName } = req.query;

    const results = await postStore.getBoard(userName);

    if (results.length) {
      results.map((result) => {
        result.postId = result.id;
        result.userId = result.user_id;
        result.userName = result.user_name;
        result.createdAt = result.created_at;
        delete result.id;
        delete result.user_id;
        delete result.user_name;
        delete result.created_at;
      });
      return res.status(200).json(results);
    } else {
      return errorMessage(res, 404);
    }
  } catch (error) {
    return errorMessage(res, 500);
  }
}
// 게시물 조회
post.getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) return errorMessage(res, 400);

    const result = await postStore.getPost([postId]);

    if (result) {
      result.postId = result.id;
      result.userId = result.user_id;
      result.userName = result.user_name;
      result.createdAt = result.created_at;
      delete result.id;
      delete result.user_id;
      delete result.user_name;
      delete result.created_at;
      return res.status(200).json(result);
    } else {
      return errorMessage(res, 404);
    }
  } catch (error) {
    return errorMessage(res, 500);
  }
}
// 게시물 등록
post.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return errorMessage(res, 400);
    
    /* 수정될 코드 */
    const token = req.headers['authorization'];
    if (!token) return errorMessage(res, 401);

    const authorization = auth.authenticateToken(token.split(' ')[1]);
    
    const result = await postStore.createPost([authorization.id, title, content]);
    /* 수정될 코드 */

    if (result.affectedRows == 1) {
      return res.status(201).json({
        "postId": result.insertId,
        "message": "게시물이 성공적으로 등록되었습니다."
      });
    }
  } catch (error) {
    return errorMessage(res, 500);
  }
}
// 게시물 수정
post.editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) return errorMessage(res, 400);

    const { userId, title, content } = req.body;
    if (!userId || !title || !content) return errorMessage(res, 400);

    /* 수정될 코드 */
    const token = req.headers['authorization'];
    if (!token) return errorMessage(res, 401);

    const authorization = auth.authenticateToken(token.split(' ')[1]);
    if (userId != authorization.id) return errorMessage(res, 403);
    /* 수정될 코드 */

    const result = await postStore.editPost([title, content, postId]);

    if (result.affectedRows == 1) {
      return res.status(200).json({
        "postId": postId,
        "message": "게시물이 성공적으로 수정되었습니다."
      });
    }
  } catch (error) {
    return errorMessage(res, 500);
  }
}
// 게시물 삭제
post.delPost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) return errorMessage(res, 400);
    
    const { userId } = req.body;
    if (!userId) return errorMessage(res, 400);

    /* 수정될 코드 */
    const token = req.headers['authorization'];
    if (!token) return errorMessage(res, 401);
    
    const authorization = auth.authenticateToken(token.split(' ')[1]);
    if (userId != authorization.id) return errorMessage(res, 403);
    /* 수정될 코드 */

    const result = await postStore.delPost([postId]);

    if (result.affectedRows == 1) {
      return res.status(200).json({
        "postId": postId,
        "message": "게시물이 성공적으로 삭제되었습니다."
      });
    }
  } catch (error) {
    return errorMessage(res, 500);
  }
}

module.exports = post;