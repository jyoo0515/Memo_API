import * as userController from './user.controller';
import Router from 'koa-router';
import { validateBody } from '../../middlewares/request-validator';
import { CreateUserDTO } from './dtos/create-user.dto';

const users = new Router();

users.post('/register', validateBody(CreateUserDTO), userController.register);
// users.post('/login', userController.login);

export default users;
