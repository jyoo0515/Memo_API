import { Context, Next } from 'koa';

export class CustomError extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
  }
}

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    const error = err as CustomError;
    ctx.status = error.status || 500;
    ctx.body = {
      message: error.message,
    };
  }
};
