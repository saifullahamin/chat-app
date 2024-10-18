import { Router, Request, Response } from 'express';
import UserController from '../controllers/UserController';
import MessageController from '../controllers/MessageController';
import ChatController from '../controllers/ChatController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/users', authMiddleware, async (req: Request, res: Response) => {
  try {
    const users = await UserController.getUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.get(
  '/messages/:chatId',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const messages = await MessageController.getMessagesForChat(req);
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }
);

router.post(
  '/chat/get-or-create',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { chatId } = await ChatController.getOrCreateChat(req);
      res.status(200).json({ chatId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch or create chat' });
    }
  }
);

export default router;
