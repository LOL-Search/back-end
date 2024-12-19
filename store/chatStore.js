const db = require('../config/db');
const errorMessage = require('../utils/errorMessage');

class ChatStore {
    allChatingRooms = async (user_id, currentPage, limit) => {
        limit = limit ? limit : 10;
        if(!user_id) user_id = -1; 
        let offset = currentPage ? limit * (currentPage-1) : 0;
        let query = `SELECT DISTINCT *, (SELECT user_id = ?) AS imIn, 
                    (SELECT COUNT(*) FROM room_members WHERE chating_rooms.id = room_members.room_id) AS nowMembers
                    FROM chating_rooms LEFT JOIN room_members ON room_members.room_id = chating_rooms.id LIMIT ? OFFSET ?`;
        let values = [`${user_id}`, `${limit}`, `${offset}`];
        console.log(values);
        let [results] = await db.execute(query, values);
        return results
    }

    createChatingRoom = async (user_id, title)=>{
        let query = `INSERT INTO chating_rooms (title) VALUES (?)`
        let matchingQuery = `INSERT INTO room_members (user_id, room_id) VALUES (?, ?)`;
        let values = [title];

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
      
            let [results] = await db.execute(query, values);
            values = [user_id, results.insertId]
            const [rows] = await db.execute(matchingQuery, values);
      
            await connection.commit();
            
            return rows;
          } catch (error) {
            await connection.rollback();
          } finally {
            connection.release();
          }
    }

    createMessage = async (user_id, content, room_id)=>{
        let query = `INSERT INTO messages (sender_id, content, room_id) VALUES (?, ?, ?)`
        let values = [`${user_id}`, content, `${room_id}`];
        console.log(values);
        let [results] = await db.execute(query, values);
        return results;
    }

    getMessages = async (user_id, room_id, currentPage, pageSize)=>{
        let limit = pageSize ? pageSize : 10;
        let offset = currentPage? limit * (pageSize-1) : 0;
        let query = `SELECT *, (SELECT sender_id = ?) AS fromMe FROM messages WHERE room_id = ? LIMIT ? OFFSET ?`;
        let values = [`${user_id}`, `${room_id}`, `${limit}`, `${offset}`];
        let [results] = await db.execute(query, values);
        return results;
    }

    joinRoom = async (user_id, room_id) => {
      let query = `INSERT INTO room_members (room_id, user_id) VALUES (?, ?)`;
      let values = [room_id, user_id];
      console.log(values);
      let [results] = await db.execute(query, values);
      return results;
    }

    outRoom = async (user_id, room_id) =>{
      let checkQuery = `SELECT (SELECT COUNT(*) FROM room_members WHERE room_id = ?) AS nums;`;
      let values = [`${room_id}`];
      const connection = await db.getConnection();
      let delMesQuery = `DELETE FROM messages WHERE room_id = ?`;
      let delRoomMemQuery = `DELETE FROM room_members WHERE user_id = ? AND room_id = ?`
      let delRoomQuery = `DELETE FROM chating_rooms WHERE id = ?;`;
      
      try { 
          await connection.beginTransaction();
          console.log(-1);
          let [results] = await db.execute(checkQuery, values);
          values = [user_id, room_id];
          let [rows] = await db.execute(delRoomMemQuery, values);
          console.log(results[0].nums);
          if (results[0].nums == 1) {
            values = [`${user_id}`, `${room_id}`];
            await db.execute(delMesQuery, values);
            values = [`${room_id}`];
            await db.execute(delRoomQuery, values);  
          }
          
          return rows;
        } catch (error) {
          await connection.rollback();
        } finally {
          connection.release();
        }
    
  }

}

module.exports = new ChatStore();