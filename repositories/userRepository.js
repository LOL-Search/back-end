const db = require('../config/db');

class UserRepository {
    async findByGoogleId(googleId) {
        const [rows] = await db.execute('SELECT * FROM user_table WHERE puuid = ?', [googleId]);
        return rows[0];
    }

    async createUser(user) {
        const { google_id, email, name } = user;
        const [result] = await db.execute(
            'INSERT INTO user_table (puuid, email, name) VALUES (?, ?, ?)',
            [google_id, email, name]
        );
        return { id: result.insertId, ...user };
    }
}

module.exports = new UserRepository();
