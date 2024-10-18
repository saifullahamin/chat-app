import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ChatAttributes {
  id?: number;
  chatName?: string;
  chatType: 'single' | 'group';
}

interface ChatCreationAttributes extends Optional<ChatAttributes, 'id'> {}

class Chat
  extends Model<ChatAttributes, ChatCreationAttributes>
  implements ChatAttributes
{
  public id!: number;
  public chatName!: string;
  public chatType!: 'single' | 'group';
}

Chat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    chatName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chatType: {
      type: DataTypes.ENUM('single', 'group'),
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'Chat',
    tableName: 'chats',
  }
);

export default Chat;
