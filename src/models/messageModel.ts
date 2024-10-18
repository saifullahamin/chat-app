import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { encrypt, decrypt } from '../utils/encryption';

interface MessageAttributes {
  id?: number;
  senderId: number;
  chatId: number;
  senderName: string;
  content: string;
  createdAt?: Date;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id'> {}

class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  public id!: number;
  public senderId!: number;
  public chatId!: number;
  public senderName!: string;
  public content!: string;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        this.setDataValue('content', encrypt(value));
      },
      get() {
        const encryptedContent = this.getDataValue('content');
        return decrypt(encryptedContent);
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    updatedAt: false,
    modelName: 'Message',
    tableName: 'messages',
    indexes: [
      {
        fields: ['senderId', 'chatId'],
      },
    ],
  }
);

export default Message;
