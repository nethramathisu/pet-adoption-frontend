import API from "./api";

// SEND MESSAGE
export const sendMessage = async (
    receiverId: string,
    petId: string,
    message: string
) => {

    const res = await API.post(
        "/messages",
        {
            receiver: receiverId, // changed here
            petId,
            message
        }
    );

    return res.data;
};

// GET CONVERSATION
export const getChats = async (
  userId: string,
  petId: string
) => {
  const res = await API.get(
    `/messages/${userId}/${petId}`
  );

  return res.data;
};

// GET MY INBOX
export const getMyChats = async () => {
  const res = await API.get(
    "/messages"
  );

  return res.data;
};

// MARK AS READ
export const markAsRead = async (
  userId: string,
  petId: string
) => {
  const res = await API.put(
    `/messages/read/${userId}/${petId}`
  );

  return res.data;
};