const db = require('../config/db');

// 소켓 연결 시 유저 정보 저장/업데이트
exports.saveUser = async (nickname, socketId) => {
    // 기존 유저 확인
    const [user] = await db.query("SELECT * FROM users WHERE nickname = ?", [nickname]);

    if (user.length > 0) {
        // 이미 가입된 회원: socketId 업데이트
        await db.query("UPDATE users SET socketId = ? WHERE id = ?", [socketId, user[0].id]);
        return { id: user[0].id, nickname: user[0].nickname, socketId };
    } else {
        // 새로운 회원 생성
        const [result] = await db.query(
            "INSERT INTO users (nickname, socketId) VALUES (?, ?)",
            [nickname, socketId]
        );
        return { id: result.insertId, nickname: nickname, socketId };
    }
};

// Check user by socket ID
exports.checkUser = async (socketId) => {
    const [rows] = await db.query("SELECT * FROM users WHERE socketId = ?", [socketId]);
    if (rows.length === 0) {
        throw new Error("User not found");
    }
    return rows[0];
};
