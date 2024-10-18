import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ message: 'Authorization denied, no token' });
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
    return;
  }
};

export default authMiddleware;
