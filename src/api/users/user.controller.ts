import { Context } from 'koa';
import { TOKEN_EXPIRY } from '../../constants';
import * as userService from './user.service';

export const register = async (ctx: Context) => {
  ctx.body = await userService.register(ctx.request.body);
};

export const login = async (ctx: Context) => {
  const token = await userService.login(ctx.request.body);
  ctx.cookies.set('access_token', token, {
    maxAge: TOKEN_EXPIRY,
    httpOnly: true,
  });
  ctx.body = { message: 'Login successful' };
};

export const logout = async (ctx: Context) => {
  ctx.cookies.set('access_token', '');
  ctx.body = { message: 'Logout successful' };
};
