import AppDataSource from '../../src/database/data-source';
import app from '../../src/app';
import request from 'supertest';
import { CreateMemoDTO } from '../../src/api/memos/dtos/create-memo.dto';
import { UpdateMemoDTO } from '../../src/api/memos/dtos/update-memo.dto';
const agent = request.agent(app.callback());
const agentTwo = request.agent(app.callback());

const NUM_MEMO = 10;
const testUser = {
  username: 'test_memo',
  password: 'test',
};

const testUserTwo = {
  username: 'test_memo2',
  password: 'test',
};

const testMemo: CreateMemoDTO = {
  title: 'test',
  content: 'testing',
};

beforeAll(() => {
  return new Promise<void>((resolve) => {
    AppDataSource.initialize().then(async () => {
      console.log('DB initialized');
      const userResOne = await agent.post('/api/users/register').send(testUser);
      expect(userResOne.status).toBe(201);

      const userResTwo = await agent.post('/api/users/register').send(testUserTwo);
      expect(userResTwo.status).toBe(201);

      const loginRes = await agent.post('/api/users/login').send(testUser);
      expect(loginRes.status).toBe(200);

      const loginResTwo = await agentTwo.post('/api/users/login').send(testUserTwo);
      expect(loginResTwo.status).toBe(200);

      for (let i = 0; i < NUM_MEMO; i++) {
        const memoRes = await agent.post('/api/memos').send(testMemo);
        expect(memoRes.status).toBe(201);
      }
      resolve();
    });
  });
});

afterAll(() => {
  return new Promise<void>((resolve) => {
    AppDataSource.dropDatabase().then(() => {
      AppDataSource.destroy().then(() => {
        console.log('DB disconnected');
        resolve();
      });
    });
  });
});

describe('e2e testing for memos', () => {
  describe('[GET] /api/memos', () => {
    it('should return a list of paginated memos', async () => {
      const res = await agent.get('/api/memos');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('pageSize', NUM_MEMO);
      expect(res.body).toHaveProperty('totalCount', NUM_MEMO);
      expect(res.body).toHaveProperty('totalPage', 1);
      expect(res.body.data).toHaveLength(10);
      expect(res.body.data[0]).toHaveProperty('title', testMemo.title);
    });

    it('should accept query parameters', async () => {
      const res = await agent.get('/api/memos?take=5&page=1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('pageSize', 5);
      expect(res.body).toHaveProperty('totalCount', NUM_MEMO);
      expect(res.body).toHaveProperty('totalPage', 2);
      expect(res.body.data).toHaveLength(5);
      expect(res.body.data[0]).toHaveProperty('title', testMemo.title);
    });
  });

  describe('[GET] /api/memos/{memoId}', () => {
    it('should return detailed memo info', async () => {
      const res = await agent.get('/api/memos/1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', testMemo.title);
      expect(res.body).toHaveProperty('content', testMemo.content);
      expect(res.body).toHaveProperty('createdBy', testUser.username);
      expect(res.body).toHaveProperty('comments');
    });

    it('should return status 404 if memo does not exist', async () => {
      const res = await agent.get('/api/memos/20');
      expect(res.status).toBe(404);
    });
  });

  describe('[POST] /api/memos', () => {
    const body: CreateMemoDTO = {
      title: 'hello',
      content: 'hi',
    };

    it('should return 201 if logged in', async () => {
      const res = await agent.post('/api/memos').send(body);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('title', body.title);
      expect(res.body).toHaveProperty('content', body.content);
    });

    it('should return 401 if not logged in', async () => {
      const res = await request(app.callback()).post('/api/memos').send(body);
      expect(res.status).toBe(401);
    });
  });

  describe('[PATCH] /api/memos/{memoId}', () => {
    const body: UpdateMemoDTO = {
      title: 'update',
    };

    it('should update memo', async () => {
      const res = await agent.patch('/api/memos/1').send(body);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', body.title);
      expect(res.body).toHaveProperty('content', testMemo.content);
    });

    it('should return 401 if not logged in', async () => {
      const res = await request(app.callback()).patch('/api/memos/1').send(body);
      expect(res.status).toBe(401);
    });

    it('should return 403 if logged in as different user', async () => {
      const res = await agentTwo.patch('/api/memos/1').send(body);
      expect(res.status).toBe(403);
    });

    it('should return status 404 if memo does not exist', async () => {
      const res = await agent.patch('/api/memos/20');
      expect(res.status).toBe(404);
    });
  });

  describe('[DELETE] /api/memos/{memoId}', () => {
    it('should delete memo with memoId', async () => {
      const deleteRes = await agent.delete('/api/memos/1');
      expect(deleteRes.status).toBe(200);

      const getRes = await agent.get('/api/memos');
      expect(getRes.status).toBe(200);
      expect(getRes.body).toHaveProperty('totalCount', NUM_MEMO);
    });

    it('should return 401 if not logged in', async () => {
      const res = await request(app.callback()).delete('/api/memos/1');
      expect(res.status).toBe(401);
    });

    it('should return 403 if logged in as different user', async () => {
      const res = await agentTwo.delete('/api/memos/2');
      expect(res.status).toBe(403);
    });

    it('should return status 404 if memo does not exist', async () => {
      const res = await agent.delete('/api/memos/20');
      expect(res.status).toBe(404);
    });
  });
});
