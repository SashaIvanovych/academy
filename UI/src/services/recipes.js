import api from "./api";

export const RecipeService = {
  async uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "recipe_upload");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dgblzmxdc/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  },
  async createRecipe(dto) {
    const response = await api.post("/recipes", dto);
    return response.data.data;
  },

  async getRecipes({ search = "", limit = 10, offset = 0, authorId }) {
    const params = { search, limit, offset };
    if (authorId) params.authorId = authorId;

    const response = await api.get("/recipes", { params });
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
