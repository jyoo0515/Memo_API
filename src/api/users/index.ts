import * as userController from './user.controller';
import Router from 'koa-router';
import { validateBody } from '../../middlewares/request-validator';
import { CreateUserDTO } from './dtos/create-user.dto';
import { LoginUserDTO } from './dtos/login-user.dto';
import { validateToken } from '../../middlewares/auth';

const users = new Router();

users.post('/register', validateBody(CreateUserDTO), userController.register);
users.post('/login', validateBody(LoginUserDTO), userController.login);
users.get('/logout', validateToken, userController.logout);

export default users;
