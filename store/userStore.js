const db = require('../config/db');

class UserStore {
  // 구글 소셜 로그인을 위한 사용자 조회
  async findByGoogleId(googleId) {
      const [rows] = await db.execute('SELECT * FROM users WHERE uuid = ?', [googleId]);
      return rows[0];
  }
  // 구글 소셜 로그인을 위한 사용자 생성
  async createUser(user) {
    const { google_id, email, name } = user;
    const [result] = await db.execute(
        'INSERT INTO users (uuid, email, name) VALUES (?, ?, ?)',
        [google_id, email, name]
    );
    return { id: result.insertId, ...user };
  }
  // 사용자 이름으로 조회
  async findByUserName(userName, page, pageSize) {
    let queryParams = [];
    let query = `SELECT * FROM users`;

    if (userName) {
      query += ` WHERE nickname = ?`;
      queryParams.push(userName);
    }

    let limit = pageSize ? pageSize : 10;
    queryParams.push(`${limit}`);
    
    let offset = page ? limit * (page - 1) : 0;
    queryParams.push(`${offset}`);
    
    query += ` LIMIT ? OFFSET ?`;
    
    const [rows] = await db.execute(query, queryParams);
    return rows;
  }

  // 사용자 ID로 조회
  async findById(userId) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', userId);
    return rows;
  }
}

module.exports = new UserStore();