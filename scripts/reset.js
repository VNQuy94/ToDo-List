import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

// Detect environment
const isDocker = !existsSync(path.join(REPO_ROOT, 'backend'));
const backendPath = isDocker ? REPO_ROOT : path.join(REPO_ROOT, 'backend');
const DATA_ROOT = path.join(REPO_ROOT, 'data');
const MODELS_ROOT = path.join(backendPath, 'src', 'models');

// Load environment variables if running locally
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(backendPath, '.env') });
}

// Import backend model
const { default: Todo } = await import(path.join(MODELS_ROOT, 'todo.js'));

// Collection registry
const RESET_COLLECTIONS = [
  {
    name: 'Todo',
    model: Todo,
    dataPath: path.join(DATA_ROOT, 'seed', 'todos.json'),
  },
];

async function reset() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('[Reset] MONGO_URI is missing');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  // Clear phase
  for (const { name, model } of RESET_COLLECTIONS) {
    const result = await model.deleteMany({});
    console.log(`[Reset] ${name}: deleted ${result.deletedCount} record(s)`);
  }

  // Seed phase
  for (const { name, model, dataPath } of RESET_COLLECTIONS) {
    const records = JSON.parse(readFileSync(dataPath, 'utf8'));
    const inserted = await model.insertMany(records);
    console.log(`[Reset] ${name}: inserted ${inserted.length} record(s)`);
  }

  await mongoose.disconnect();
}

reset().catch((err) => {
  console.error('[Reset] Error:', err.message);
  process.exit(1);
});
