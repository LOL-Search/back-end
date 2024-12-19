const db = require('../config/db');
const errorMessage = require('../utils/errorMessage');

class ChatStore {
  async saveChat(content, user, roomId) {
    const query = `INSERT INTO messages (room_id, sender_id, content, created_at) 
                   VALUES (?, ?, ?, NOW())`;

    try {
      const [result] = await db.query(query, [roomId, user, content]);
      return {
        id: result.insertId,    
        room_id: roomId,        
        sender_id: user,        
        content: content,       
        created_at: new Date()  
      };
    } catch (error) {
      console.error("Error saving chat:", error);
      throw errorMessage(null, 500);
    }
  }
}

module.exports = new ChatStore();