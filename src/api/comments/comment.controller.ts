import { Context } from 'koa';
import * as commentService from './comment.service';

export const createComment = async (ctx: Context) => {
  ctx.body = await commentService.createComment(ctx.request.body, ctx.state.user);
  ctx.status = 201;
};

export const updateComment = async (ctx: Context) => {
  const { commentId } = ctx.params;
  ctx.body = await commentService.updateComment(commentId, ctx.request.body, ctx.state.user);
};

export const deleteComment = async (ctx: Context) => {
  const { commentId } = ctx.params;
  ctx.body = await commentService.deleteComment(commentId, ctx.state.user);
};
