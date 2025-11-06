import { Collection, Db, MongoClient } from 'mongodb';
import { Blog } from '../blogs/types/blog';
import { Post } from '../posts/types/post';
import { SETTINGS } from '../core/settings/settings';
import { User } from '../users/types/user';
import { Comment } from '../comments/types/comment';
import { RevokedToken } from '../auth/types/revokedTokens';
import {UserSession} from "../auth/types/userSession";

const BLOGS_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';
const USERS_COLLECTION_NAME = 'users';
const COMMENTS_COLLECTION_NAME = 'comments';
const REVOKED_TOKENS_COLLECTION_NAME = 'revokedTokens';
const SESSIONS_COLLECTION_NAME = 'sessions';

export let client: MongoClient;
export let blogsCollection: Collection<Blog>;
export let postsCollection: Collection<Post>;
export let usersCollection: Collection<User>;
export let commentsCollection: Collection<Comment>;
export let revokedTokensCollection: Collection<RevokedToken>;
export let sessionsCollection: Collection<UserSession>;
// Connect to DB
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  // Init collections
  blogsCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
  postsCollection = db.collection<Post>(POSTS_COLLECTION_NAME);
  usersCollection = db.collection<User>(USERS_COLLECTION_NAME);
  commentsCollection = db.collection<Comment>(COMMENTS_COLLECTION_NAME);
  revokedTokensCollection = db.collection<RevokedToken>(
    REVOKED_TOKENS_COLLECTION_NAME,
  );
  sessionsCollection = db.collection<UserSession>(SESSIONS_COLLECTION_NAME);
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
}
