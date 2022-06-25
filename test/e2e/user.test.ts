import AppDataSource from '../../src/database/data-source';
import app from '../../src/app';
import request from 'supertest';
import { CreateUserDTO } from '../../src/api/users/dtos/create-user.dto';
import { LoginUserDTO } from '../../src/api/users/dtos/login-user.dto';
const agent = request.agent(app.callback());

beforeAll(() => {
  return new Promise<void>((resolve) => {
    AppDataSource.initialize().then(() => {
      console.log('DB initialized');
      resolve();
    });
  });
});

afterAll(() => {
  return new Promise<void>((resolve) => {
    AppDataSource.destroy().then(() => {
      console.log('DB disconnected');
      resolve();
    });
  });
});

describe('e2e testing for users', () => {
  describe('[POST] /api/users/register', () => {
    it('should return 400 on invalid form', async () => {
      const body = {
        nickname: 'hi',
        password: 'hello',
      };

      const res = await agent.post('/api/users/register').send(body);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should create user on valid input', async () => {
      const body: CreateUserDTO = {
        username: 'test',
        password: 'test',
      };

      const res = await agent.post('/api/users/register').send(body);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('username', body.username);
    });

    it('should refuse to create user on duplicate username', async () => {
      const body: CreateUserDTO = {
        username: 'test',
        password: 'test',
      };

      const res = await agent.post('/api/users/register').send(body);
      expect(res.status).toBe(400);
    });
  });

  describe('[POST] /api/users/login', () => {
    it('should return 404 on non existent user', async () => {
      const body: LoginUserDTO = {
        username: 'nothere',
        password: 'hi',
      };

      const res = await agent.post('/api/users/login').send(body);
      expect(res.status).toBe(404);
    });

    it('should return 401 on wrong password', async () => {
      const body: LoginUserDTO = {
        username: 'test',
        password: 'testing',
      };

      const res = await agent.post('/api/users/login').send(body);
      expect(res.status).toBe(401);
    });

    it('should return 200 on successful login', async () => {
      const body: LoginUserDTO = {
        username: 'test',
        password: 'test',
      };

      const res = await agent.post('/api/users/login').send(body);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
    });
  });

  describe('[GET] /api/users/logout', () => {
    it('should logout user', async () => {
      const res = await agent.get('/api/users/logout');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Logout successful');
    });

    it('should return 401 if user not logged in', async () => {
      const res = await agent.get('/api/users/logout');
      expect(res.status).toBe(401);
    });
  });
});
