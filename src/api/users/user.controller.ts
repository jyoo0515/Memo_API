import { Context } from 'koa';
import * as userService from './user.service';

export const register = async (ctx: Context) => {
  ctx.body = await userService.register(ctx.request.body);
};

// export const login = async (ctx: Context) => {};
