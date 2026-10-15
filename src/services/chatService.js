import api from "./api.js";

const chatService = {
  async getChatPartner(currentUserId, otherUserId) {
    const response = await api.get(
      `/chat/partner/${currentUserId}/${otherUserId}`
    );

    return response.data;
  },

  async getConversation(currentUserId, otherUserId) {
    const response = await api.get(
      `/chat/${currentUserId}/${otherUserId}`
    );

    return response.data;
  },

  async sendMessage(senderId, receiverId, content) {
    const response = await api.post("/chat/send", {
      senderId: Number(senderId),
      receiverId: Number(receiverId),
      content: content.trim(),
    });

    return response.data;
  },
};

export default chatService;