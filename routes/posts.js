const express = require('express');
const router = express.Router();

const post = require('../controllers/postController');
const comment = require('../controllers/commentController');

/**
 *  @swagger
 *    paths:
 *      /posts:
 *        get:
 *          summary: "게시판 조회"
 *          tags:
 *            - 게시물 API
 *          parameters:
 *            - in: query
 *              name: keyword
 *              description: "keyword for search"
 *              required: false
 *              schema:
 *                type: string
 *            - in: query
 *              name: page
 *              description: "Current page (default: 1 page)"
 *              required: false
 *              schema:
 *                type: integer
 *            - in: query
 *              name: pageSize
 *              description: "Number of posts per page (default: 10)"
 *              required: false
 *              schema:
 *                type: integer
 *          responses:
 *            200:
 *              description: "게시판 조회 성공"
 *              content:
 *                application/json:
 *                  example: {
 *                        count: 3,
 *                        rows: [
 *                          {
 *                            "title": "아아, 대상혁",
 *                            "content": "오늘도 나는 대상혁을 숭배할 수 밖에 없다!",
 *                            "views": 6,
 *                            "comments": 1,
 *                            "postId": 3,
 *                            "userId": 3,
 *                            "userName": "tester",
 *                            "createdAt": "2024-12-14 09:48:42"
 *                          },
 *                          {
 *                            "title": "우리팀 유미는...",
 *                            "content": "우리팀 유미 나한테 붙어서 아무것도 안함:( PC방 라면시킨듯...",
 *                            "views": 0,
 *                            "comments": 0,
 *                            "postId": 8,
 *                            "userId": 3,
 *                            "userName": "tester",
 *                            "createdAt": "2024-12-14 17:13:35"
 *                          },
 *                          {
 *                            "title": "아케인 시즌2",
 *                            "content": "아케인 시즌2 징크스 이쁘다!",
 *                            "views": 0,
 *                            "comments": 2,
 *                            "postId": 10,
 *                            "userId": 3,
 *                            "userName": "tester",
 *                            "createdAt": "2024-12-18 09:06:07"
 *                          },
 *                        ]
 *                      }
 *            404:
 *              description: "게시물 없음"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "NOT_FOUND",
 *                    message: "해당 내용이 없습니다."
 *                  }
 *            500:
 *              description: "서버 에러"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "INTERNAL_SERVER_ERROR",
 *                    message: "서버 내부에서 에러가 발생했습니다."
 *                  }
 */
router.get('/', post.getBoard);
/**
 *  @swagger
 *    paths:
 *      /posts:
 *        post:
 *          summary: "게시물 등록"
 *          tags:
 *            - 게시물 API
 *          requestBody:
 *            required: true
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                    content:
 *                      type: string
 *                  required:
 *                    - title
 *                    - content
 *                example:
 *                  title: "새로운 챔피언 분석"
 *                  content: "이번 패치로 인해 게임 메타가 바뀌었습니다."
 *          responses:
 *            201:
 *              description: "게시물 등록 성공"
 *              content:
 *                application/json:
 *                  example: {
 *                    postId: 101,
 *                    message: "게시물이 성공적으로 등록되었습니다."
 *                  }
 *            400:
 *              description: "유효하지 않은 요청"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "INVALID_REQUEST",
 *                    message: "필수 필드가 누락되었습니다."
 *                  }
 *            401:
 *              description: "인증 실패"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "UNAUTHORIZED",
 *                    message: "회원 인증이 필요합니다."
 *                  }
 *            500:
 *              description: "서버 에러"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "INTERNAL_SERVER_ERROR",
 *                    message: "서버 내부에서 에러가 발생했습니다."
 *                  }
 */
router.post('/', post.createPost);
/**
 *  @swagger
 *    paths:
 *      /posts/{postId}:
 *        get:
 *          summary: "게시물 조회"
 *          tags:
 *            - 게시물 API
 *          parameters:
 *            - in: path
 *              name: postId
 *              schema:
 *                type: integer
 *              required: true
 *          responses:
 *            200:
 *              description: "게시판 조회 성공"
 *              content:
 *                application/json:
 *                  example: {
 *                    title: "우리팀 유미는...",
 *                    content: "우리팀 유미 나한테 붙어서 아무것도 안함:( PC방 라면시킨듯...",
 *                    views: 132,
 *                    comments: 0,
 *                    postId: 2,
 *                    userId: 2,
 *                    userName: 카시오페아,
 *                    createdAt: "2024-11-11 15:20:11",
 *                  }
 *            404:
 *              description: "게시물을 찾을 수 없음"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "POST_NOT_FOUND",
 *                    message: "요청한 게시물을 찾을 수 없습니다."
 *                  }
 *            500:
 *              description: "서버 에러"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "INTERNAL_SERVER_ERROR",
 *                    message: "서버 내부에서 에러가 발생했습니다."
 *                  }
 */
router.get('/:postId', post.getPost);
/**
 * @swagger
 *      /posts/{postId}:
 *        put:
 *          summary: "게시물 수정"
 *          tags:
 *            - 게시물 API
 *          parameters:
 *            - in: path
 *              name: postId
 *              schema:
 *                type: integer
 *              required: true
 *          requestBody:
 *            required: true
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                    content:
 *                      type: string
 *                  required:
 *                    - title
 *                    - content
 *                example:
 *                  title: "업데이트된 제목"
 *                  content: "수정된 게시물 내용입니다."
 *          responses:
 *            200:
 *              description: "게시물 수정 성공"
 *              content:
 *                application/json:
 *                  example: {
 *                    postId: 101,
 *                    message: "게시물이 성공적으로 수정되었습니다."
 *                  }
 *            400:
 *              description: "유효하지 않은 요청"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "INVALID_REQUEST",
 *                    message: "필수 필드가 누락되었습니다."
 *                  }
 *            401:
 *              description: "인증 실패"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "UNAUTHORIZED",
 *                    message: "회원 인증이 필요합니다."
 *                  }
 *            403:
 *              description: "수정 권한 없음"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "FORBIDDEN",
 *                    message: "이 게시물을 수정할 권한이 없습니다."
 *                  }
 *            500:
 *              description: "서버 에러"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "INTERNAL_SERVER_ERROR",
 *                    message: "서버 내부에서 에러가 발생했습니다."
 *                  }
 */
router.put('/:postId', post.editPost);
/**
 * @swagger
 *      /posts/{postId}:
 *        delete:
 *          summary: "게시물 삭제"
 *          tags:
 *            - 게시물 API
 *          parameters:
 *            - in: path
 *              name: postId
 *              schema:
 *                type: integer
 *              required: true
 *          responses:
 *            200:
 *              description: "게시물 삭제 성공"
 *              content:
 *                application/json:
 *                  example: {
 *                    postId: 101,
 *                    message: "게시물이 성공적으로 삭제되었습니다."
 *                  }
 *            400:
 *              description: "유효하지 않은 요청"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "INVALID_REQUEST",
 *                    message: "필수 필드가 누락되었습니다."
 *                  }
 *            401:
 *              description: "인증 실패"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "UNAUTHORIZED",
 *                    message: "회원 인증이 필요합니다."
 *                  }
 *            403:
 *              description: "수정 권한 없음"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "FORBIDDEN",
 *                    message: "이 게시물을 수정할 권한이 없습니다."
 *                  }
 *            500:
 *              description: "서버 에러"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "INTERNAL_SERVER_ERROR",
 *                    message: "서버 내부에서 에러가 발생했습니다."
 *                  }
 */
router.delete('/:postId', post.delPost);
/**
 *  @swagger
 *    paths:
 *      /posts/{postId}/comments:
 *        get:
 *          summary: "댓글 조회"
 *          tags:
 *            - 댓글 API
 *          parameters:
 *            - in: path
 *              name: postId
 *              required: true
 *              schema:
 *                type: integer
 *          responses:
 *            200:
 *              description: "댓글 조회 성공"
 *              content:
 *                application/json:
 *                  example: [
 *                      {
 *                        content: "저도 그렇게 생각합니다.",
 *                        commentId: 1,
 *                        postId: 5,
 *                        userId: 99,
 *                        userName: "오리아나",
 *                        createdAt: "2024-11-11 16:00:00"
 *                      },
 *                      {
 *                        content: "확실히 OP 챔피언 같네요.",
 *                        commentId: 2,
 *                        postId: 5,
 *                        userId: 7,
 *                        userName: "티모",
 *                        createdAt: "2024-11-11 16:10:00"
 *                      }
 *                  ]
 *            400:
 *              description: "잘못된 요청"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "BAD_REQUEST",
 *                    message: "필수 필드가 누락되었습니다."
 *                  }
 *            404:
 *              description: "게시물 또는 댓글을 찾을 수 없음"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "NOT_FOUND",
 *                    message: "해당 게시물 또는 댓글이 없습니다."
 *                  }
 *            500:
 *              description: "서버 에러"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "INTERNAL_SERVER_ERROR",
 *                    message: "서버 내부에서 에러가 발생했습니다."
 *                  }
 */
router.get('/:postId/comments', comment.getComment);
/**
 *  @swagger
 *    paths:
 *      /posts/{postId}/comments:
 *        post:
 *          summary: "댓글 등록"
 *          tags:
 *            - 댓글 API
 *          parameters:
 *            - in: path
 *              name: postId
 *              required: true
 *              schema:
 *                type: integer
 *          requestBody:
 *            required: true
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    content:
 *                      type: string
 *                  required:
 *                    - content
 *                example:
 *                  content: "쉽지 않네..."
 *          responses:
 *            201:
 *              description: "댓글 등록 성공"
 *              content:
 *                application/json:
 *                  example: {
 *                    commentId: 101,
 *                    message: "댓글이 성공적으로 등록되었습니다."
 *                  }
 *            400:
 *              description: "잘못된 요청"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "BAD_REQUEST",
 *                    message: "필수 필드가 누락되었습니다."
 *                  }
 *            401:
 *              description: "인증 실패"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "UNAUTHORIZED",
 *                    message: "회원 인증이 필요합니다."
 *                  }
 *            404:
 *              description: "게시물 또는 댓글을 찾을 수 없음"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "NOT_FOUND",
 *                    message: "해당 게시물 또는 댓글이 없습니다."
 *                  }
 *            500:
 *              description: "서버 에러"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "INTERNAL_SERVER_ERROR",
 *                    message: "서버 내부에서 에러가 발생했습니다."
 *                  }
 */
router.post('/:postId/comments', comment.createComment);
/**
 *  @swagger
 *    paths:
 *      /posts/{postId}/comments/{commentId}:
 *        put:
 *          summary: "댓글 수정"
 *          tags:
 *            - 댓글 API
 *          parameters:
 *            - in: path
 *              name: postId
 *              required: true
 *              schema:
 *                type: integer
 *            - in: path
 *              name: commentId
 *              required: true
 *              schema:
 *                type: integer
 *          requestBody:
 *            required: true
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    content:
 *                      type: string
 *                  required:
 *                    - content
 *                example:
 *                  content: "수정된 댓글 내용입니다."
 *          responses:
 *            200:
 *              description: "댓글 수정 성공"
 *              content:
 *                application/json:
 *                  example: {
 *                    postId: 101,
 *                    message: "댓글이 성공적으로 수정되었습니다."
 *                  }
 *            400:
 *              description: "잘못된 요청"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "BAD_REQUEST",
 *                    message: "필수 필드가 누락되었습니다."
 *                  }
 *            401:
 *              description: "인증 실패"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "UNAUTHORIZED",
 *                    message: "회원 인증이 필요합니다."
 *                  }
 *            404:
 *              description: "게시물 또는 댓글을 찾을 수 없음"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "NOT_FOUND",
 *                    message: "해당 게시물 또는 댓글이 없습니다."
 *                  }
 *            500:
 *              description: "서버 에러"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "INTERNAL_SERVER_ERROR",
 *                    message: "서버 내부에서 에러가 발생했습니다."
 *                  }
 */
router.put('/:postId/comments/:commentId', comment.editComment);
/**
 *  @swagger
 *    paths:
 *      /posts/{postId}/comments/{commentId}:
 *        delete:
 *          summary: "댓글 삭제"
 *          tags:
 *            - 댓글 API
 *          parameters:
 *            - in: path
 *              name: postId
 *              required: true
 *              schema:
 *                type: integer
 *            - in: path
 *              name: commentId
 *              required: true
 *              schema:
 *                type: integer
 *          responses:
 *            200:
 *              description: "댓글 삭제 성공"
 *              content:
 *                application/json:
 *                  example: {
 *                    postId: 101,
 *                    message: "댓글이 삭제되었습니다."
 *                  }
 *            400:
 *              description: "잘못된 요청"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "BAD_REQUEST",
 *                    message: "필수 필드가 누락되었습니다."
 *                  }
 *            401:
 *              description: "인증 실패"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "UNAUTHORIZED",
 *                    message: "회원 인증이 필요합니다."
 *                  }
 *            404:
 *              description: "게시물 또는 댓글을 찾을 수 없음"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "NOT_FOUND",
 *                    message: "해당 게시물 또는 댓글이 없습니다."
 *                  }
 *            500:
 *              description: "서버 에러"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "INTERNAL_SERVER_ERROR",
 *                    message: "서버 내부에서 에러가 발생했습니다."
 *                  }
 */
router.delete('/:postId/comments/:commentId', comment.delComment);

module.exports = router;