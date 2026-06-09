import API from "./api";

// APPLY FOR PET
export const applyForPet = async (
  petId: string,
  message: string
) => {
  const res = await API.post(
    `/api/applications/${petId}`,
    { message }
  );

  return res.data;
};

// USER APPLICATIONS
export const getMyApplications = async () => {
  const res = await API.get(
    "/api/applications/my"
  );

  return res.data;
};

// SHELTER APPLICATIONS
export const getShelterApplications =
  async () => {
    const res = await API.get(
      "/api/applications/shelter"
    );

    return res.data;
  };

// UPDATE STATUS
export const updateApplicationStatus =
  async (
    appId: string,
    status: string,
    responseMessage?: string
  ) => {
    const res = await API.put(
      `/api/applications/${appId}`,
      {
        status,
        responseMessage,
      }
    );

    return res.data;
  };