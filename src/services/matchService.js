import api from "./api.js";

const matchService = {
  async getStudentsWhoCanTeach(userId) {
    const response = await api.get(`/matches/learn/${userId}`);
    return response.data;
  },

  async getStudentsWhoWantToLearn(userId) {
    const response = await api.get(`/matches/teach/${userId}`);
    return response.data;
  },

  async getAllMatches(userId) {
    const [canTeach, wantToLearn] = await Promise.all([
      this.getStudentsWhoCanTeach(userId),
      this.getStudentsWhoWantToLearn(userId),
    ]);

    return {
      canTeach,
      wantToLearn,
    };
  },
};

export default matchService;