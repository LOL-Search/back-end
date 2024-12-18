const db = require('../config/db');

class UserStore {
  async findByGoogleId(googleId) {
      const [rows] = await db.execute('SELECT * FROM user_table WHERE uuid = ?', [googleId]);
      return rows[0];
  }

  async createUser(user) {
    const { google_id, email, name } = user;
    const [result] = await db.execute(
        'INSERT INTO user_table (uuid, email, name) VALUES (?, ?, ?)',
        [google_id, email, name]
    );
    return { id: result.insertId, ...user };
  }

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
}

module.exports = new UserStore();