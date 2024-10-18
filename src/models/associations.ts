import Message from './messageModel';
import User from './userModel';
import Chat from './chatModel';
import ChatMember from './chatMemberModel';

export const defineAssociations = () => {
  Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
  Message.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' });
  User.hasMany(Message, { foreignKey: 'senderId', as: 'messages' });
  Chat.hasMany(Message, { foreignKey: 'chatId', as: 'messages' });
  Chat.hasMany(ChatMember, { foreignKey: 'chatId', as: 'members' });
  ChatMember.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' });
  ChatMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(ChatMember, { foreignKey: 'userId', as: 'chats' });
};
