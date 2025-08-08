import api from "./api";

export const RecipeService = {
  async createRecipe(dto) {
    const response = await api.post("/recipes", dto);
    return response.data.data;
  },

  async getRecipes({ search = "", limit = 10, offset = 0 }) {
    const response = await api.get("/recipes", {
      params: { search, limit, offset },
    });
    return response.data.data;
  },

  async getRecipeById(id) {
    const response = await api.get(`/recipes/${id}`);
    return response.data.data;
  },

  async updateRecipe(id, dto) {
    const response = await api.patch(`/recipes/${id}`, dto);
    return response.data.data;
  },

  async deleteRecipe(id) {
    const response = await api.delete(`/recipes/${id}`);
    return response.data.data;
  },
};
