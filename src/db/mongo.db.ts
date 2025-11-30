import * as mongoose from 'mongoose';

const dbName = 'learning';
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`;

// Connect to DB
export async function runDB(url: string): Promise<void> {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to the database');
  } catch (e) {
    await mongoose.disconnect();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

export async function stopDb() {
  await mongoose.disconnect();
}
