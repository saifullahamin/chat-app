import { Server as SocketServer, Socket } from 'socket.io';
import { userManager } from './managers/userManager';
import { chatMemberManager } from './managers/chatMemberManager';
import { messageManager } from './managers/messageManager';
import jwt, { JwtPayload } from 'jsonwebtoken';
import http from 'http';

interface DecodedToken extends JwtPayload {
  id: number;
}

interface AuthenticatedSocket extends Socket {
  user?: {
    id: number;
  };
}

export const initializeSocket = (server: http.Server) => {
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use((socket: AuthenticatedSocket, next) => {
    const cookieString = socket.handshake.headers.cookie || '';
    const token = cookieString
      .split('; ')
      .find((cookie) => cookie.startsWith('accessToken='))
      ?.split('=')[1];

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as DecodedToken;
      if (decoded && decoded.id) {
        socket.user = { id: decoded.id };
        next();
      } else {
        next(new Error('Invalid token payload'));
      }
    } catch (error) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    const userId = socket.user?.id;

    if (userId) {
      console.log(`User connected: ${userId}`);

      try {
        const chatMemberships = await chatMemberManager.findAllChatMemberships(
          userId
        );

        chatMemberships.forEach((chatMembership) => {
          const chatRoomId = chatMembership.chatId.toString();
          socket.join(chatRoomId);
          console.log(`User ${userId} joined chat room: ${chatRoomId}`);
        });
      } catch (error) {
        console.error('Failed to join chat rooms:', error);
      }
    }

    socket.on('sendMessage', async ({ chatId, content, tempId }) => {
      if (!chatId || !content) return;

      const sender = await userManager.findById(userId!);
      if (!sender) {
        console.error('Sender not found');
        return;
      }

      try {
        const savedMessage = await messageManager.createMessage(
          userId!,
          chatId,
          content,
          sender.displayName
        );
        // throw new Error();

        socket.emit('receiveMessage', {
          id: savedMessage.dataValues.id,
          chatId: savedMessage.dataValues.chatId,
          content,
          createdAt: savedMessage.dataValues.createdAt,
          senderId: savedMessage.dataValues.senderId,
          senderName: savedMessage.dataValues.senderName,
          tempId,
        });

        socket.broadcast.to(chatId.toString()).emit('receiveMessage', {
          id: savedMessage.dataValues.id,
          chatId: savedMessage.dataValues.chatId,
          content,
          createdAt: savedMessage.dataValues.createdAt,
          senderId: savedMessage.dataValues.senderId,
          senderName: savedMessage.dataValues.senderName,
        });

        console.log(`Message sent to chat room ${chatId}`);
      } catch (error) {
        console.error('Failed to save message:', error);
        socket.emit('messageError', { tempId });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
    });
  });
};
