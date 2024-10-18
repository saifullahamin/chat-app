import { Router, Request, Response } from 'express';
import AuthController from '../controllers/AuthController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken, user } = await AuthController.signup(
      req
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: 'Signup successful',
      name: user.name,
      id: user.id,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res
        .status(400)
        .json({ error: 'An unknown error occurred during signup' });
    }
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken, user } = await AuthController.login(req);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: 'Login successful',
      name: user.name,
      id: user.id,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred during login' });
    }
  }
});

router.post('/verify-token', (req: Request, res: Response) => {
  try {
    const { userId, newAccessToken } = AuthController.verifyToken(req);
    if (newAccessToken) {
      res
        .status(200)
        .json({ message: 'Token is valid', userId, newAccessToken });
    } else {
      res.status(200).json({ message: 'Token is valid', userId });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(401).json({ message: 'Invalid or expired access token' });
    }
  }
});

router.post('/refresh', (req: Request, res: Response) => {
  try {
    const newAccessToken = AuthController.refreshAccessToken(req);
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.status(200).json({ message: 'Token refreshed' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(403).json({ message: err.message });
    } else {
      res
        .status(403)
        .json({ message: 'An unknown error occurred during token refresh' });
    }
  }
});

router.get('/get-user', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = AuthController.verifyToken(req);
    const user = await AuthController.getUserDetails(userId);
    res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(401).json({ message: 'Invalid or expired access token' });
    }
  }
});

export default router;
