import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import api from './api';

const app = new Koa();
const router = new Router();
router.use('/api', api.routes());

app.use(koaBody());
app.use(logger());
app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', console.error);

export default app;
