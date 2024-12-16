const db = require('../config/db');

class PostStore {
  // 게시판 조회
  async getBoard(userName) {
    let queryParams = [];
    let query = `SELECT posts.*, users.nickname AS user_name, (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS comments
                 FROM posts JOIN users ON posts.user_id = users.id`;
    if (userName) {
      query += ` WHERE users.nickname = ?`;
      queryParams.push(userName);
    }
    const [rows] = await db.execute(query, queryParams);
    return rows;
  }
  // 게시물 조회
  async getPost(queryParams) {
    const selectQuery = `SELECT posts.*, users.nickname AS user_name, (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS comments
                         FROM posts JOIN users ON posts.user_id = users.id`;
    const updateQuery = `UPDATE posts SET views = views + 1 WHERE id = ?`;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      await db.execute(updateQuery, queryParams);

      const [rows] = await db.execute(selectQuery, queryParams);

      await connection.commit();
      
      return rows[0];
    } catch (error) {
      await connection.rollback();
    } finally {
      connection.release();
    }
  }
  // 게시물 작성
  async createPost(queryParams) {
    const query = `INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)`;
    const [rows] = await db.execute(query, queryParams);
    return rows;
  }
  // 게시물 수정
  async editPost(queryParams) {
    const query = `UPDATE posts SET title = ?, content = ? WHERE id = ?`;
    const [rows] = await db.execute(query, queryParams);
    return rows;
  }
  // 게시물 삭제
  async delPost(queryParams) {
    const delPostQuery = `DELETE FROM posts WHERE id = ?`;
    const delCommentQuery = `DELETE FROM comments WHERE post_id = ?`;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      await db.execute(delCommentQuery, queryParams);
      const [rows] = await db.execute(delPostQuery, queryParams);
      await connection.commit();
      return rows;
    } catch (error) {
      await connection.rollback();
    } finally {
      connection.release();
    }
  }
}

module.exports = new PostStore();