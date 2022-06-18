import { Context } from 'koa';
import * as memoService from './memo.service';

export const getAllMemos = async (ctx: Context) => {
  ctx.body = await memoService.getAllMemos();
};

export const getOneMemo = async (ctx: Context) => {
  const { memoId } = ctx.params;
  ctx.body = await memoService.getOneMemo(memoId);
};

export const createMemo = async (ctx: Context) => {
  ctx.body = await memoService.createMemo(ctx.request.body);
  ctx.status = 201;
};

export const updateMemo = async (ctx: Context) => {
  const { memoId } = ctx.params;
  ctx.body = await memoService.updateMemo(memoId, ctx.request.body);
};

export const deleteMemo = async (ctx: Context) => {
  const { memoId } = ctx.params;
  ctx.body = await memoService.deleteMemo(memoId);
};
