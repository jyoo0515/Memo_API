import * as commentController from './comment.controller';
import Router from 'koa-router';
import { validateToken } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/request-validator';
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { UpdateCommentDTO } from './dtos/update-comment.dto';

const comments = new Router();

comments.post('/', validateToken, validateBody(CreateCommentDTO), commentController.createComment);
comments.patch('/:commentId', validateToken, validateBody(UpdateCommentDTO), commentController.updateComment);
comments.delete('/:commentId', validateToken, commentController.deleteComment);

export default comments;
