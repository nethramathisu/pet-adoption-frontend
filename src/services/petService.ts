import API from "./api";

export const getPets = async (query?: string) => {
  const res = await API.get(`/api/pet?${query}`);
  return res.data;
};