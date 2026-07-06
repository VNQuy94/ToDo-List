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
const SEED_COLLECTIONS = [
  {
    name: 'Todo',
    model: Todo,
    dataPath: path.join(DATA_ROOT, 'seed', 'todos.json'),
  },
];

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('[Seed] MONGO_URI is missing');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  for (const { name, model, dataPath } of SEED_COLLECTIONS) {
    // Check if already seeded
    const count = await model.countDocuments();
    if (count > 0) {
      console.log(`[Seed] ${name}: already seeded. Skipping...`);
      continue;
    }

    // Load records
    const records = JSON.parse(readFileSync(dataPath, 'utf8'));

    // Insert records
    const inserted = await model.insertMany(records);
    console.log(`[Seed] ${name}: inserted ${inserted.length} record(s)`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('[Seed] Error:', err.message);
  process.exit(1);
});
