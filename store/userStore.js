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

  async findByUserName(userName) {
    let queryParams = [];
    let query = `SELECT * FROM users`;

    if (userName) {
      query += ` WHERE nickname = ?`;
      queryParams.push(userName);
    }
    const [rows] = await db.execute(query, queryParams);
    return rows;
  }
}

module.exports = new UserStore();