import * as memoController from './memo.controller';
import Router from 'koa-router';
import { validateBody } from '../../middlewares/request-validator';
import { CreateMemoDTO } from './dtos/create-memo.dto';
import { UpdateMemoDTO } from './dtos/update-memo.dto';

const memos = new Router();

memos.get('/', memoController.getAllMemos);
memos.post('/', validateBody(CreateMemoDTO), memoController.createMemo);
memos.get('/:memoId', memoController.getOneMemo);
memos.patch('/:memoId', validateBody(UpdateMemoDTO), memoController.updateMemo);
memos.delete('/:memoId', memoController.deleteMemo);

export default memos;
