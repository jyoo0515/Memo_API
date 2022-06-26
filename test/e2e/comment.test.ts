import AppDataSource from '../../src/database/data-source';
import app from '../../src/app';
import request from 'supertest';
import { CreateCommentDTO } from '../../src/api/comments/dtos/create-comment.dto';
import { CreateMemoDTO } from '../../src/api/memos/dtos/create-memo.dto';
import { UpdateCommentDTO } from '../../src/api/comments/dtos/update-comment.dto';
const agent = request.agent(app.callback());
const agentTwo = request.agent(app.callback());

const testUser = {
  username: 'test_comment',
  password: 'test',
};

const testUserTwo = {
  username: 'test_comment2',
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

      const memoRes = await agent.post('/api/memos').send(testMemo);
      expect(memoRes.status).toBe(201);

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

describe('e2e testing for comments', () => {
  describe('[POST] /api/comments', () => {
    const body: CreateCommentDTO = {
      memoId: 1,
      content: 'test',
    };

    it('should create comment and return 201 if logged in', async () => {
      const postRes = await agent.post('/api/comments').send(body);
      expect(postRes.status).toBe(201);
      expect(postRes.body).toHaveProperty('content', body.content);

      const getRes = await agent.get('/api/memos/1');
      expect(getRes.status).toBe(200);
      expect(getRes.body).toHaveProperty('comments');
      expect(getRes.body.comments).toHaveLength(1);
      expect(getRes.body.comments[0]).toHaveProperty('content', 'test');
    });

    it('should return 401 if not logged in', async () => {
      const res = await request(app.callback()).post('/api/comments').send(body);
      expect(res.status).toBe(401);
    });

    it('should return 404 if memoId is invalid', async () => {
      body.memoId = 99;
      const res = await agent.post('/api/comments').send(body);
      expect(res.status).toBe(404);
    });
  });

  describe('[PATCH] /api/comments/{commentId}', () => {
    const body: UpdateCommentDTO = {
      content: 'update',
    };

    it('should update comment if logged in', async () => {
      const res = await agent.patch('/api/comments/1').send(body);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('content', body.content);
    });

    it('should return 401 if not logged in', async () => {
      const res = await request(app.callback()).patch('/api/comments/1').send(body);
      expect(res.status).toBe(401);
    });

    it('should return 403 if logged in as different user', async () => {
      const res = await agentTwo.patch('/api/comments/1').send(body);
      expect(res.status).toBe(403);
    });

    it('should return status 404 if memo does not exist', async () => {
      const res = await agent.patch('/api/comments/20');
      expect(res.status).toBe(404);
    });
  });

  describe('[DELETE] /api/comments/{memoId}', () => {
    it('should return 401 if not logged in', async () => {
      const res = await request(app.callback()).delete('/api/comments/1');
      expect(res.status).toBe(401);
    });

    it('should return 403 if logged in as different user', async () => {
      const res = await agentTwo.delete('/api/comments/1');
      expect(res.status).toBe(403);
    });

    it('should return status 404 if memo does not exist', async () => {
      const res = await agent.delete('/api/comments/20');
      expect(res.status).toBe(404);
    });

    it('should delete memo with memoId', async () => {
      const deleteRes = await agent.delete('/api/comments/1');
      expect(deleteRes.status).toBe(200);

      const getRes = await agent.get('/api/memos/1');
      expect(getRes.status).toBe(200);
      expect(getRes.body).toHaveProperty('comments');
      expect(getRes.body.comments).toHaveLength(0);
    });
  });
});
