import { Request } from 'express';
import { messageManager } from '../managers/messageManager';

class MessageController {
  public static async getMessagesForChat(req: Request) {
    const { chatId } = req.params;

    const messages = await messageManager.getMessagesForChat(
      parseInt(chatId, 10)
    );

    return messages;
  }
}

export default MessageController;
