const db = require('../config/db');

exports.saveChat = async (content, user, roomId) => {
    const [result] = await db.query(
        "INSERT INTO messages (room_id, sender_id, content, created_at) VALUES (?, ?, ?, NOW())",
        [roomId, user.id, content]
    );
    console.log("Message saved:", result); // 이 부분에서 메시지 저장 결과 확인
    return {
        id: result.insertId, // 메시지 ID
        chat: content,       // 메시지 내용
        user: { id: user.id, nickname: user.nickname }, // 유저 정보
        roomId: roomId,      // 채팅방 ID
        createdAt: new Date().toISOString(), // 현재 시각 반환 (ISO 형식)
    };
};
