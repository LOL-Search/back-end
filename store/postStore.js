const db = require('../config/db');

class PostStore {
  // 게시판 조회
  async getBoard(keyword, page, pageSize) {
    let queryParams = [];
    let query = `SELECT posts.*, users.nickname AS user_name, (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS comments
                 FROM posts JOIN users ON posts.user_id = users.id`;
    if (keyword) {
      console.log(keyword);
      query += ` WHERE posts.title LIKE ? OR posts.content LIKE ? OR users.nickname LIKE ?`;
      queryParams.push(`%${keyword}%`);
      queryParams.push(`%${keyword}%`);
      queryParams.push(`%${keyword}%`);
    }

    let limit = pageSize ? pageSize : 10;
    queryParams.push(`${limit}`);
    
    let offset = page ? limit * (page - 1) : 0;
    queryParams.push(`${offset}`);
    
    query += ` LIMIT ? OFFSET ?`;
    const [rows] = await db.execute(query, queryParams);
    return rows;
  }
  // 게시물 조회
  async getPost(queryParams) {
    const selectQuery = `SELECT posts.*, users.nickname AS user_name, (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS comments
                         FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?`;
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
      return error;
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
    const query = `UPDATE posts SET title = ?, content = ? WHERE id = ? AND user_id = ?`;
    const [rows] = await db.execute(query, queryParams);
    return rows;
  }
  // 게시물 삭제
  async delPost(queryParams) {
    const delPostQuery = `DELETE FROM posts WHERE id = ? AND user_id = ?`;
    const delCommentQuery = `DELETE FROM comments WHERE post_id = ?`;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      const [rows] = await db.execute(delPostQuery, queryParams);
      if (rows.affectedRows == 1) {
        await db.execute(delCommentQuery, [queryParams[0]]);
      } else {
        await connection.rollback();
        return rows;
      }
      await connection.commit();
      return rows;
    } catch (error) {
      await connection.rollback();
      return error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new PostStore();