
import { Request, Response, NextFunction } from 'express';

// Simple authentication middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // In a real implementation, you would validate the token
    // For now, check against a hardcoded admin token
    const adminToken = process.env.ADMIN_TOKEN || 'admin-token-secret';
    
    if (token !== adminToken) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
