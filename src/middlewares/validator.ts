import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Context, Next } from 'koa';
import { CustomError } from '../util/custom-error';

export const validateBody = (schema: { new (): any }) => {
  return async (ctx: Context, next: Next) => {
    const target = plainToClass(schema, ctx.request.body);
    try {
      await validateOrReject(target, { whitelist: true, forbidNonWhitelisted: true });
      ctx.request.body = target;
      await next();
    } catch (err) {
      console.error(err);
      throw new CustomError(400, 'Bad request');
    }
  };
};
