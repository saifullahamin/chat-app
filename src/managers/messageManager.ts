import Message from '../models/messageModel';

const createMessage = async (
  senderId: number,
  chatId: number,
  content: string,
  senderName: string
) => {
  return Message.create({
    senderId,
    chatId,
    content,
    senderName,
  });
};

const getMessagesForChat = async (chatId: number) => {
  return Message.findAll({
    where: { chatId },
    order: [['createdAt', 'ASC']],
  });
};

export const messageManager = {
  createMessage,
  getMessagesForChat,
};
