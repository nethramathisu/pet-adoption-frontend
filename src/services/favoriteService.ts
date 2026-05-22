import API from "./api";

export const toggleFavorite = async (petId: string) => {
  return await API.put(`/user/favorites/${petId}`);
};

export const getFavorites = async () => {
  const res = await API.get("/user/favorites");
  return res.data;
};