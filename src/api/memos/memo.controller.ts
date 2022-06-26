import { Context } from 'koa';
import { DEFAULT_PAGE_COUNT, DEFAULT_PAGE_SIZE } from '../../constants';
import * as memoService from './memo.service';

export const getAllMemos = async (ctx: Context) => {
  const take = Number(ctx.request.query.take) || DEFAULT_PAGE_SIZE;
  const page = Number(ctx.request.query.page) || DEFAULT_PAGE_COUNT;
  ctx.body = await memoService.getAllMemos({ take, page });
};

export const getOneMemo = async (ctx: Context) => {
  const { memoId } = ctx.params;
  ctx.body = await memoService.getOneMemo(memoId);
};

export const createMemo = async (ctx: Context) => {
  ctx.body = await memoService.createMemo(ctx.request.body, ctx.state.user);
  ctx.status = 201;
};

export const updateMemo = async (ctx: Context) => {
  const { memoId } = ctx.params;
  ctx.body = await memoService.updateMemo(memoId, ctx.request.body, ctx.state.user);
};

export const deleteMemo = async (ctx: Context) => {
  const { memoId } = ctx.params;
  ctx.body = await memoService.deleteMemo(memoId, ctx.state.user);
};
