import Chat from "../models/chatModel";
import ChatMember from "../models/chatMemberModel";

const createSingleChat = async (userId: number, selectedUserId: number) => {
  const chat = await Chat.create({ chatType: "single" });

  await ChatMember.bulkCreate([
    { chatId: chat.id, userId },
    { chatId: chat.id, userId: selectedUserId },
  ]);

  return chat;
};

const findSingleChat = async (userId: number, selectedUserId: number) => {
  // interface ChatResult {
  //   chatId: string;
  // }

  // const { chatId } = await sequelize.query<ChatResult>(`
  //   SELECT cm1."chatId"::text as "chatId"
  //   FROM chat_members cm1
  //   JOIN chat_members cm2 ON cm1."chatId" = cm2."chatId"
  //   JOIN chats c ON c.id = cm1."chatId"
  //   WHERE cm1."userId" = :firstUserId
  //   AND cm2."userId" = :secondUserId
  //   AND c."chatType" = 'single'
  //   LIMIT 1
  // `, {
  //   replacements: {
  //     firstUserId: 3,
  //     secondUserId: 2
  //   },
  //   plain: true,
  //   type: QueryTypes.SELECT
  // });

  // Temp solution

  const user1Chats = await ChatMember.findAll({
    attributes: ["chatId"],
    where: { userId: userId },
  });

  const user2Chats = await ChatMember.findAll({
    attributes: ["chatId"],
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
