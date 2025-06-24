import { Request, Response, NextFunction } from 'express';

// For demo: static user map
const users = [
  { id: 'user1', name: 'Alice', email: 'alice@example.com' },
  { id: 'user2', name: 'Bob', email: 'bob@example.com' },
];

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  // For demo, token is just the user email
  const user = users.find((u) => u.email === token);
  if (user) {
    (req as any).user = user;
  }
  next();
} 