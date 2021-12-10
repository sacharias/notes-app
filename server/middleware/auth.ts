import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token)
    return res.status(403).json({ message: 'A token is required for auth' });

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    delete decoded.iat;
    delete decoded.exp;

    req.user = decoded;
  } catch (error) {
    return res.status(401).send('invalid token');
  }
  return next();
};

export { verifyToken };
