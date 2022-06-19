import * as memoController from './memo.controller';
import Router from 'koa-router';
import { validateBody } from '../../middlewares/request-validator';
import { CreateMemoDTO } from './dtos/create-memo.dto';
import { UpdateMemoDTO } from './dtos/update-memo.dto';
import { validateToken } from '../../middlewares/auth';

const memos = new Router();

memos.get('/', memoController.getAllMemos);
memos.post('/', validateToken, validateBody(CreateMemoDTO), memoController.createMemo);
memos.get('/:memoId', memoController.getOneMemo);
memos.patch('/:memoId', validateToken, validateBody(UpdateMemoDTO), memoController.updateMemo);
memos.delete('/:memoId', validateToken, memoController.deleteMemo);

export default memos;
