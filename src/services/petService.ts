import API from "./api";

export const getPets = async (query?: string) => {
  const res = await API.get(`/pet?${query}`);
  return res.data;
};