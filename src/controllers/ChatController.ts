import { Request } from "express";
import { chatManager } from "../managers/chatManager";

class ChatController {
  public static async getOrCreateChat(req: Request) {
    const { userId, selectedUserId } = req.body;

    const chat = await chatManager.getOrCreateSingleChat(
      userId,
      selectedUserId
    );

    return { chatId: chat.id };
  }
}

export default ChatController;
