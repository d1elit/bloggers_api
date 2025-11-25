import { Collection, Db, MongoClient, WithId } from 'mongodb';
import { Blog } from '../blogs/types/blog';
import { Post } from '../posts/types/post';
import { SETTINGS } from '../core/settings/settings';
import { User } from '../users/types/user';
import { Comment } from '../comments/types/comment';
import { RevokedToken } from '../auth/types/revokedTokens';
import { UserSession } from '../sessions/types/userSession';
import * as mongoose from 'mongoose';
import { HydratedDocument, model, Model } from 'mongoose';

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

const dbName = 'learning';
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`;

// Connect to DB
export async function runDB(url: string): Promise<void> {
  await mongoose.connect(mongoURI);
  // client = new MongoClient(url);
  // const db: Db = client.db(SETTINGS.DB_NAME);

  // Init collections
  // blogsCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
  // postsCollection = db.collection<Post>(POSTS_COLLECTION_NAME);
  // usersCollection = db.collection<User>(USERS_COLLECTION_NAME);
  // commentsCollection = db.collection<Comment>(COMMENTS_COLLECTION_NAME);
  // revokedTokensCollection = db.collection<RevokedToken>(
  //   REVOKED_TOKENS_COLLECTION_NAME,
  // );
  // sessionsCollection = db.collection<UserSession>(SESSIONS_COLLECTION_NAME);
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to the database');
  } catch (e) {
    await mongoose.disconnect();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
}
