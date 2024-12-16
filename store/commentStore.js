const db = require('../config/db');

class CommentStore {
  // 댓글 조회
  async getComment(queryParams) {
    const query = `SELECT comments.*, users.nickname AS user_name
                   FROM comments JOIN users ON comments.user_id = users.id
                   WHERE post_id = ?`;
    const [rows] = await db.execute(query, queryParams);
    return rows;
  }
  // 댓글 작성
  async createComment(queryParams) {
    try {
      const query = `INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)`;
      const [rows] = await db.execute(query, queryParams);
      return rows;  
    } catch (error) {
      console.log(error);
    }
  }
  // 댓글 수정
  async editComment(queryParams) {
    const query = `UPDATE comments SET content = ? WHERE id = ?`;
    const [rows] = await db.execute(query, queryParams);
    return rows;
  }
  // 댓글 삭제
  async delComment(queryParams) {
    const query = `DELETE FROM comments WHERE id = ?`;
    const [rows] = await db.execute(query, queryParams);
    return rows; 
  }
}

module.exports = new CommentStore();