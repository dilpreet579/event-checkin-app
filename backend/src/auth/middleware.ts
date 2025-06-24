import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (token) {
    const user = await prisma.user.findUnique({ where: { email: token } });
    if (user) {
      (req as any).user = user;
    }
  }
  next();
} 