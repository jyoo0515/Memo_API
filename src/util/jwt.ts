import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { TOKEN_EXPIRY } from '../constants';
const JWT_SECRET = String(process.env.JWT_SECRET);

export interface DecodedJWT {
  username: string;
  iat: number;
  exp: number;
}

export const generateToken = (username: string) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ username: username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

export const decodeToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};
