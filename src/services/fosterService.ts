import API from "./api";

export const assignFoster = async (
  petId: string,
  fosterId: string
) => {
  const res = await API.post("/api/foster/assign", {
    petId,
    fosterId,
  });

  return res.data;
};

export const getMyFosterPets =
  async () => {
    const res = await API.get(
      "/api/foster/myfosterPets"
    );

    return res.data;
  };

export const removeFoster =
  async (petId: string) => {
    const res = await API.delete(
      `/api/foster/remove/${petId}`
    );

    return res.data;
  };

export const addFosterUpdate =
  async (
    petId: string,
    message: string
  ) => {
    const res = await API.post(
      `/api/foster/update/${petId}`,
      { message }
    );

    return res.data;
  };

export const getFosterUpdates =
  async (petId: string) => {
    const res = await API.get(
      `/api/foster/updates/${petId}`
    );

    return res.data;
  };


  export const getAllFosters = async () => {
    const res = await API.get("/api/foster");
    return res.data;
};