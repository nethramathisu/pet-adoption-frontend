import API from "./api";

export const toggleFavorite = async (petId: string) => {
  return await API.put(`/api/user/favorites/${petId}`);
};

export const getFavorites = async () => {
  const res = await API.get("/api/user/favorites");
  return res.data;
};