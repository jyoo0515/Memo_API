import { Context, Next } from 'koa';
import { CustomError } from '../util/custom-error';
import { DecodedJWT, decodeToken } from '../util/jwt';

export const validateToken = async (ctx: Context, next: Next) => {
  const token = ctx.cookies.get('access_token');

  if (!token) throw new CustomError(401, 'Login required');

  try {
    const decoded = (await decodeToken(token)) as DecodedJWT;
    ctx.state.user = decoded.username;
    return next();
  } catch (err) {
    throw new CustomError(401, 'Invalid token');
  }
};
