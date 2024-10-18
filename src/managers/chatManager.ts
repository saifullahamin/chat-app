import Chat from '../models/chatModel';
import ChatMember from '../models/chatMemberModel';
import { Op } from 'sequelize';
import sequelize from '../config/database';

const createSingleChat = async (userId: number, selectedUserId: number) => {
  const chat = await Chat.create({ chatType: 'single' });

  await ChatMember.bulkCreate([
    { chatId: chat.id, userId },
    { chatId: chat.id, userId: selectedUserId },
  ]);

  return chat;
};

// Temp solution
const findSingleChat = async (userId: number, selectedUserId: number) => {
  const user1Chats = await ChatMember.findAll({
    attributes: ['chatId'],
    where: { userId: userId },
  });

  const user2Chats = await ChatMember.findAll({
    attributes: ['chatId'],
    where: { userId: selectedUserId },
  });

  const user1ChatIds = user1Chats.map((chat) => chat.chatId);
  const user2ChatIds = user2Chats.map((chat) => chat.chatId);

  const commonChatId = user1ChatIds.find((chatId) =>
    user2ChatIds.includes(chatId)
  );
  if (commonChatId) {
    return Chat.findOne({
      where: { id: commonChatId },
    });
  }

  return null;
};

const getOrCreateSingleChat = async (
  userId: number,
  selectedUserId: number
) => {
  let chat = await findSingleChat(userId, selectedUserId);
  if (!chat) {
    chat = await createSingleChat(userId, selectedUserId);
  }
  return chat;
};

export const chatManager = {
  createSingleChat,
  findSingleChat,
  getOrCreateSingleChat,
};
