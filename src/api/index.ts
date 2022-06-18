import Router from 'koa-router';
import memos from './memos';

const api = new Router();

api.use('/memos', memos.routes());

export default api;
