import { Request } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { userManager } from '../managers/userManager';

interface DecodedToken extends JwtPayload {
  id: number;
}

class AuthController {
  private static generateAccessToken(userId: number): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: '15m',
    });
  }

  private static generateRefreshToken(userId: number): string {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });
  }

  public static async signup(req: Request) {
    const { email, password, displayName } = req.body;

    const existingUser = await userManager.findByEmail(email);
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userManager.createUser(
      email,
      hashedPassword,
      displayName
    );

    const accessToken = this.generateAccessToken(newUser.id);
    const refreshToken = this.generateRefreshToken(newUser.id);

    return {
      accessToken,
      refreshToken,
      user: { name: newUser.displayName, id: newUser.id },
    };
  }

  public static async login(req: Request) {
    const { email, password } = req.body;
    const user = await userManager.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: { name: user.displayName, id: user.id },
    };
  }

  public static verifyToken(req: Request) {
    const { accessToken, refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    if (accessToken && accessToken !== 'undefined') {
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_SECRET!
      ) as DecodedToken;
      return { userId: decoded.id };
    }

    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as DecodedToken;

      const newAccessToken = this.generateAccessToken(payload.id);
      return { userId: payload.id, newAccessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  public static refreshAccessToken(req: Request) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as DecodedToken;

    const newAccessToken = this.generateAccessToken(payload.id);

    return newAccessToken;
  }

  public static async getUserDetails(userId: number) {
    const user = await userManager.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      displayName: user.displayName,
    };
  }
}

export default AuthController;
