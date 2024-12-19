const chatStore = require("../store/chatStore");
const errorMessage = require("../utils/errorMessage");

class ChatController {
  async saveChat(content, user, roomId) {
    try {
      const newChat = await chatStore.saveChat(content, user, roomId);
      return newChat;
    } catch (error) {
      console.error("Error in saveChat:", error);
      throw errorMessage(null, 500);
    }
  }
}

module.exports = new ChatController();