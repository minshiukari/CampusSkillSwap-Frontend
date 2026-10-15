import api from "./api.js";

const requestService = {
  async sendRequest(senderId, receiverId) {
    const response = await api.post("/swaps", {
      senderId: Number(senderId),
      receiverId: Number(receiverId),
    });

    return response.data;
  },

  async getReceivedRequests(userId) {
    const response = await api.get(`/swaps/received/${userId}`);
    return response.data;
  },

  async getSentRequests(userId) {
    const response = await api.get(`/swaps/sent/${userId}`);
    return response.data;
  },

  async updateRequestStatus(requestId, status, userId) {
    const normalizedStatus = String(status).toUpperCase();

    if (!["ACCEPTED", "REJECTED"].includes(normalizedStatus)) {
      throw new Error("Invalid request status.");
    }

    const response = await api.put(
      `/swaps/${requestId}/${normalizedStatus}`,
      null,
      {
        params: {
          userId: Number(userId),
        },
      }
    );

    return response.data;
  },
};

export default requestService;