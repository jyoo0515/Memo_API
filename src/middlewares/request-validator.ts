import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Context, Next } from 'koa';
import { CustomError } from '../util/custom-error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateBody = (schema: { new (): any }) => {
  return async (ctx: Context, next: Next) => {
    const target = plainToClass(schema, ctx.request.body);
    const errors = await validate(target, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      throw new CustomError(400, 'Bad Request');
    } else {
      ctx.request.body = target;
      return next();
    }
  };
};
