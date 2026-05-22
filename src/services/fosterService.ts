import API from "./api";

export const assignFoster = async (
  petId: string,
  fosterId: string
) => {
  const res = await API.post("/foster/assign", {
    petId,
    fosterId,
  });

  return res.data;
};

export const getMyFosterPets =
  async () => {
    const res = await API.get(
      "/foster/myfosterPets"
    );

    return res.data;
  };

export const removeFoster =
  async (petId: string) => {
    const res = await API.delete(
      `/foster/remove/${petId}`
    );

    return res.data;
  };

export const addFosterUpdate =
  async (
    petId: string,
    message: string
  ) => {
    const res = await API.post(
      `/foster/update/${petId}`,
      { message }
    );

    return res.data;
  };

export const getFosterUpdates =
  async (petId: string) => {
    const res = await API.get(
      `/foster/updates/${petId}`
    );

    return res.data;
  };


  export const getAllFosters = async () => {
    const res = await API.get("/foster");
    return res.data;
};