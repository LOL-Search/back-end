const jwtUtil = require('../utils/jwt');
const commentStore = require('../store/commentStore');

const comment = {}

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
        message: "해당 게시물 또는 댓글이 없습니다."
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

// 댓글 조회
comment.getComment = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) return errorMessage(res, 400);

    const results = await commentStore.getComment([postId]);

    if (results.length) {
      results.map((result) => {
        result.commentId = result.id;
        result.postId = result.post_id;
        result.userId = result.user_id;
        result.userName = result.user_name;
        result.createdAt = result.created_at;
        delete result.id;
        delete result.post_id;
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

// 댓글 등록
comment.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) return errorMessage(res, 400);
    
    const { content } = req.body;
    if (!content) return errorMessage(res, 400);

    /* 수정될 코드 */
    const token = req.headers['authorization'];
    if (!token) return errorMessage(res, 401);

    const authorization = jwtUtil.verifyToken(token.split(' ')[1]);
    
    const result = await commentStore.createComment([authorization.id, postId, content]);
    /* 수정될 코드 */

    if (result.affectedRows == 1) {
      return res.status(201).json({
        "commentId": result.insertId,
        "message": "댓글이 성공적으로 등록되었습니다."
      });
    } else {
      return errorMessage(res, 404); 
    }
  } catch (error) {
    console.log(error);
    return errorMessage(res, 500);
  }
}

// 댓글 수정
comment.editComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    if (!postId || !commentId) return errorMessage(res, 400);

    const { userId, content } = req.body;
    if (!userId || !content) return errorMessage(res, 400);

    /* 수정될 코드 */
    const token = req.headers['authorization'];
    if (!token) return errorMessage(res, 401);

    const authorization = jwtUtil.verifyToken(token.split(' ')[1]);
    if (userId != authorization.id) return errorMessage(res, 403);
    /* 수정될 코드 */

    const result = await commentStore.editComment([content, commentId]);

    if (result.affectedRows == 1) {
      return res.status(200).json({
        "commentId": commentId,
        "message": "댓글이 성공적으로 수정되었습니다."
      });
    } else {
      return errorMessage(res, 404);
    }
  } catch (error) {
    return errorMessage(res, 500);
  }
}

// 댓글 삭제
comment.delComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    if (!postId || !commentId) return errorMessage(res, 400);

    const { userId } = req.body;
    if (!userId) return errorMessage(res, 400);

    /* 수정될 코드 */
    const token = req.headers['authorization'];
    if (!token) return errorMessage(res, 401);

    const authorization = jwtUtil.verifyToken(token.split(' ')[1]);
    if (userId != authorization.id) return errorMessage(res, 403);
    /* 수정될 코드 */

    const result = await commentStore.delComment([commentId]);

    if (result.affectedRows == 1) {
      return res.status(200).json({
        "commentId": commentId,
        "message": "댓글이 성공적으로 삭제되었습니다."
      });
    } else {
      return errorMessage(res, 404);
    }
  } catch (error) {
    return errorMessage(res, 500);
  }
}

module.exports = comment;