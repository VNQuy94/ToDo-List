/**
 * scripts/reset.js
 *
 * Orchestrates a full database reset: clear all records, then re-seed.
 * Equivalent to running seed:clear followed by seed.
 *
 * Local usage:
 *   pnpm seed:reset
 *   node scripts/reset.js
 *
 * Docker usage (from repo root):
 *   docker compose exec backend node /app/scripts/reset.js
 */

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

// Detect if we are running inside the Docker container
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
    console.error('[Reset] ✖  MONGO_URI is not defined. Check backend/.env');
    process.exit(1);
  }

  console.log('[Reset] Connecting to MongoDB…');
  await mongoose.connect(mongoUri);
  console.log(`[Reset] Connected: ${mongoose.connection.host}`);

  console.log('\n[Reset] ── Phase 1: Clear ──');
  for (const { name, model } of RESET_COLLECTIONS) {
    const result = await model.deleteMany({});
    console.log(`[Reset]   ${name}: deleted ${result.deletedCount} record(s)`);
  }

  console.log('\n[Reset] ── Phase 2: Seed ──');
  for (const { name, model, dataPath } of RESET_COLLECTIONS) {
    const records = JSON.parse(readFileSync(dataPath, 'utf8'));
    const inserted = await model.insertMany(records);
    console.log(`[Reset]   ${name}: inserted ${inserted.length} record(s)`);
  }

  await mongoose.disconnect();
  console.log('\n[Reset] ✔  Database reset complete. Connection closed.');
}

reset().catch((err) => {
  console.error('[Reset] ✖  Fatal error:', err.message);
  process.exit(1);
});
