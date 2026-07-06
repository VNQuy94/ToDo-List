/**
 * scripts/seed.js
 *
 * Loads backend/.env (local) or uses injected MONGO_URI (Docker),
 * connects to MongoDB, clears existing records, and inserts seed data.
 *
 * Local usage:
 *   pnpm seed
 *   node scripts/seed.js
 *
 * Docker usage (from repo root):
 *   docker compose exec backend node /app/scripts/seed.js
 */

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

// Detect if we are running inside the Docker container
// Locally: REPO_ROOT contains a 'backend' directory
// Docker: REPO_ROOT is '/app' which contains the backend source code directly
const isDocker = !existsSync(path.join(REPO_ROOT, 'backend'));
const backendPath = isDocker ? REPO_ROOT : path.join(REPO_ROOT, 'backend');
const DATA_ROOT = isDocker ? path.join(REPO_ROOT, 'data') : path.join(REPO_ROOT, 'data');
const MODELS_ROOT = path.join(backendPath, 'src', 'models');

// Load environment variables if running locally
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(backendPath, '.env') });
}

// Import the existing backend Todo model
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
    console.error('[Seed] ✖  MONGO_URI is not defined. Check backend/.env');
    process.exit(1);
  }

  console.log('[Seed] Connecting to MongoDB…');
  await mongoose.connect(mongoUri);
  console.log(`[Seed] Connected: ${mongoose.connection.host}`);

  for (const { name, model, dataPath } of SEED_COLLECTIONS) {
    console.log(`\n[Seed] ── Collection: ${name} ──`);

    // Check if the collection already has documents (Idempotency check)
    const count = await model.countDocuments();
    if (count > 0) {
      console.log(`[Seed]   Database already seeded. Skipping...`);
      continue;
    }

    // Read seed JSON
    const records = JSON.parse(readFileSync(dataPath, 'utf8'));

    // Insert seed records
    const inserted = await model.insertMany(records);
    console.log(`[Seed]   Inserted ${inserted.length} record(s)`);
  }

  await mongoose.disconnect();
  console.log('\n[Seed] ✔  Done. Database connection closed.');
}

seed().catch((err) => {
  console.error('[Seed] ✖  Fatal error:', err.message);
  process.exit(1);
});
