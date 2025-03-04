
import { Request, Response, NextFunction } from 'express';

// Middleware to authenticate admin requests
export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
    }
    
    const token = authHeader.split(' ')[1];
    const adminToken = process.env.ADMIN_TOKEN || 'admin-token-secret';
    
    // Validate the token
    if (token !== adminToken) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    
    // If the token is valid, proceed
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
