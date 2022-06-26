import Router from 'koa-router';
import comments from './comments';
import memos from './memos';
import users from './users';

const api = new Router();

api.use('/memos', memos.routes());
api.use('/users', users.routes());
api.use('/comments', comments.routes());

export default api;
