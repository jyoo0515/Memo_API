import Router from 'koa-router';
import memos from './memos';
import users from './users';

const api = new Router();

api.use('/memos', memos.routes());
api.use('/users', users.routes());

export default api;
