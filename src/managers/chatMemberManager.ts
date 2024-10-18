import ChatMember from '../models/chatMemberModel';

const findAllChatMemberships = async (userId: number) => {
  return ChatMember.findAll({
    where: { userId },
  });
};

const addMemberToChat = async (chatId: number, userId: number) => {
  return ChatMember.create({
    chatId,
    userId,
  });
};

export const chatMemberManager = {
  findAllChatMemberships,
  addMemberToChat,
};
