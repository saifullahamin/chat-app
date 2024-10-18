import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ChatMemberAttributes {
  id?: number;
  chatId: number;
  userId: number;
}

interface ChatMemberCreationAttributes
  extends Optional<ChatMemberAttributes, 'id'> {}

class ChatMember
  extends Model<ChatMemberAttributes, ChatMemberCreationAttributes>
  implements ChatMemberAttributes
{
  public id!: number;
  public chatId!: number;
  public userId!: number;
}

ChatMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'ChatMember',
    tableName: 'chat_members',
    indexes: [
      {
        fields: ['chatId', 'userId'],
        unique: true,
      },
    ],
  }
);

export default ChatMember;
