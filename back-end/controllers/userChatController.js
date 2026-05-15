import { getUsersList , getChatMessagesByUser } from "../models/chatModel.js";

export const fetchUsersList = async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await getUsersList(userId);

    res.status(200).json({
      status: { code: 200 },
      response: users,
    });
  } catch (error) {
    res.status(500).json({
      status: { code: 500, message: error.message },
    });
  }
};



export const fetchChatMessages = async (req, res) => {
  try {

      const senderId =
        req.user.id;
    const {  receiverId } = req.params;

    const messages = await getChatMessagesByUser(senderId, receiverId);

    res.status(200).json({
      status: { code: 200 },
      response: messages,
    });
  } catch (error) {
    res.status(500).json({
      status: { code: 500, message: error.message },
    });
  }
};
