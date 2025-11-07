import { describe } from 'node:test';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { clearDb } from '../../utils/clear-db';

describe('COMMENTS_TESTS', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();
  beforeAll(async () => {
    await runDB('mongodb://localhost:27017/db-test');
    await clearDb(app);
  });
  afterAll(async () => {
    await stopDb();
  });
});
