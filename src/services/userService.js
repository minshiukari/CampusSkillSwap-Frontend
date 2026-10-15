import api from "./api.js";

const userService = {
  async register(userData) {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  async getAllUsers() {
    const response = await api.get("/users");
    return response.data;
  },

  async getUserById(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async updateSkills(userId, skills) {
    const response = await api.put(`/users/${userId}/skills`, skills);
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

export default userService;