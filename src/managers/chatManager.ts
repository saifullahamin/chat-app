import Chat from "../models/chatModel";
import ChatMember from "../models/chatMemberModel";
import { QueryTypes } from "sequelize";
import sequelize from "../config/database";

interface ChatResult {
  chatId: string;
}

const createSingleChat = async (userId: number, selectedUserId: number) => {
  const chat = await Chat.create({ chatType: "single" });

  await ChatMember.bulkCreate([
    { chatId: chat.id, userId },
    { chatId: chat.id, userId: selectedUserId },
  ]);

  return chat;
};

const findSingleChat = async (userId: number, selectedUserId: number) => {
  const result = await sequelize.query<ChatResult>(
    `
    SELECT cm1."chatId"::text as "chatId"
    FROM chat_members cm1
    JOIN chat_members cm2 ON cm1."chatId" = cm2."chatId"
    JOIN chats c ON c.id = cm1."chatId"
    WHERE cm1."userId" = :firstUserId
    AND cm2."userId" = :secondUserId
    AND c."chatType" = 'single'
    LIMIT 1
  `,
    {
      replacements: {
        firstUserId: userId,
        secondUserId: selectedUserId,
      },
      plain: true,
      type: QueryTypes.SELECT,
    }
  );

  if (result) {
    return Chat.findOne({
      where: { id: result?.chatId },
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
