import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../config/authConfig';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ msg: 'Token not provided !!' });
  }
  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    res.status(401).json({ msg: 'Token invalid !!' });
  }
};
