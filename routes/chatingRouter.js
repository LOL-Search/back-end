const express = require('express');
const chats = require('../controllers/chatingController');
const router = express.Router();
router.use(express.json());

/**
 *  @swagger
 *    paths:
 *      /chats:
 *        post:
 *          summary: "채팅방 등록"
 *          tags:
 *            - 채팅방 API
 *          parameters:
 *            - in: header
 *              name: Authorization
 *              description: "Bearer token"
 *              required: true
 *              schema:
 *                type: string
 *          requestBody:
 *            required: true
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                  required:
 *                    - title
 *                example:
 *                  title: "3:3 구해요"
 *                  
 *          responses:
 *            201:
 *              description: "채팅방 등록 성공"
 *              content:
 *                application/json:
 *                  example: {
 *                    message: "채팅방이 성공적으로 등록되었습니다."
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
router.post('/', chats.createChating);  

/**
 *  @swagger
 *    paths:
 *      /chats:
 *        get:
 *          summary: "채팅방 조회"
 *          tags:
 *            - 채팅방 API
 *          parameters:
 *            - in: header
 *              name: Authorization
 *              description: "Bearer token"
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
 *              description: "Number of chatingRooms per page (default: 10)"
 *              required: false
 *              schema:
 *                type: integer
 *          responses:
 *            200:
 *              description: "채팅방 조회 성공"
 *              content:
 *                application/json:
 *                  example: [
 *                    {
 *                      id : 1,
 *                      title : "3:3 구해요",
 *                      imIn : true,
 *                      nowMembers : 1
 *                    },
 *                    {
 *                      id : 5,
 *                      title : "3:3 구해요",
 *                      imIn : true,
 *                      nowMembers : 1
 *                    },
 *                    {
 *                      id : 3,
 *                      title : "3:3 구해요",
 *                      imIn : true,
 *                      nowMembers : 1
 *                    }
 *                  ]
 *            404:
 *              description: "채팅방 없음"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "NOT_FOUND",
 *                    message: "채팅방이 없습니다."
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
router.get('/', chats.allChatingRooms); 



/**
 *  @swagger
 *    paths:
 *      /chats/message:
 *        post:
 *          summary: "메시지 등록"
 *          tags:
 *            - 채팅방 API
 *          parameters:
 *            - in: header
 *              name: Authorization
 *              description: "Bearer token"
 *              required: true
 *              schema:
 *                type: string
 *          requestBody:
 *            required: true
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    roomId:
 *                      type: integer
 *                    content:
 *                      type: string
 *                  required:
 *                    - content
 *                    - roomId
 *                example:
 *                  content : "안녕하세요"
 *                  roomId : 11
 *                  
 *          responses:
 *            201:
 *              description: "메시지 등록 성공"
 *              content:
 *                application/json:
 *                  example: {
 *                    message: "메시지가이 성공적으로 등록되었습니다."
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
router.post('/message', chats.createMessage);


/**
 *  @swagger
 *    paths:
 *      /chats/{id}:
 *        get:
 *          summary: "채팅방 상세 조회"
 *          tags:
 *            - 채팅방 API
 *          parameters:
 *            - in: header
 *              name: Authorization
 *              description: "Bearer token"
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
 *              description: "Number of chatingRooms per page (default: 10)"
 *              required: false
 *              schema:
 *                type: integer
 *          responses:
 *            200:
 *              description: "채팅방 조회 성공"
 *              content:
 *                application/json:
 *                  example: [
 *                    {
 *                      id : 1,
 *                      senderId : 5,
 *                      content : "안녕하세요",
 *                      createdAt : "2024-12-18 10:00:00",
 *                      fromMe : true,
 *                    },
 *                    {
 *                      id : 1,
 *                      senderId : 5,
 *                      content : "안녕하세요",
 *                      createdAt : "2024-12-18 10:00:00",
 *                      fromMe : true,
 *                    },
 *                     {
 *                      id : 1,
 *                      senderId : 1,
 *                      content : "안녕하세요",
 *                      createdAt : "2024-12-18 10:00:00z",
 *                      fromMe : true,
 *                    }
 *                  ]
 *            404:
 *              description: "채팅방 없음"
 *              content:
 *                application/json:
 *                  example: {
 *                    errorCode: "NOT_FOUND",
 *                    message: "채팅방이 없습니다."
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
router.get('/:id', chats.getMessages);



/**
 *  @swagger
 *    paths:
 *      /chats/join:
 *        post:
 *          summary: "채팅방 입장"
 *          tags:
 *            - 채팅방 API
 *          parameters:
 *            - in: header
 *              name: Authorization
 *              description: "Bearer token"
 *              required: true
 *              schema:
 *                type: string
 *          requestBody:
 *            required: true
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    room_id:
 *                      type: integer
 *                    
 *                  required:
 *                    - roomId
 *                example:
 *                  roomId : 11
 *                  
 *          responses:
 *            201:
 *              description: "채팅방 입장 성공"
 *              content:
 *                application/json:
 *                  example: {
 *                    message: "채팅방에 입장했습니다."
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
router.post('/join', chats.joinRoom);


/**
 *  @swagger
 *    paths:
 *      /chats/{id}:
 *        delete:
 *          summary: "채팅방 나가기"
 *          tags:
 *            - 채팅방 API
 *          parameters:
 *            - in: header
 *              name: Authorization
 *              required: true
 *              schema:
 *                type: string
 *          responses:
 *            200:
 *              description: "채팅방 나오기 성공"
 *              content:
 *                application/json:
 *                  example: {
 *                    message: "채팅방에서 나왔습니다."
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
router.delete('/:id', chats.outRoom);

module.exports = router