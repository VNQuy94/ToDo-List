/**
 * scripts/clear.js
 *
 * Connects to MongoDB and deletes all documents from seeded collections.
 *
 * Local usage:
 *   pnpm seed:clear
 *   node scripts/clear.js
 *
 * Docker usage (from repo root):
 *   docker compose exec backend node /app/scripts/clear.js
 */

import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

// Detect if we are running inside the Docker container
const isDocker = !existsSync(path.join(REPO_ROOT, 'backend'));
const backendPath = isDocker ? REPO_ROOT : path.join(REPO_ROOT, 'backend');
const MODELS_ROOT = path.join(backendPath, 'src', 'models');

// Load environment variables if running locally
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(backendPath, '.env') });
}

// Import the existing backend Todo model
const { default: Todo } = await import(path.join(MODELS_ROOT, 'todo.js'));

// Collection registry
const CLEAR_COLLECTIONS = [
  { name: 'Todo', model: Todo },
];

async function clear() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('[Clear] ✖  MONGO_URI is not defined. Check backend/.env');
    process.exit(1);
  }

  console.log('[Clear] Connecting to MongoDB…');
  await mongoose.connect(mongoUri);
  console.log(`[Clear] Connected: ${mongoose.connection.host}`);

  for (const { name, model } of CLEAR_COLLECTIONS) {
    const result = await model.deleteMany({});
    console.log(`[Clear]   ${name}: deleted ${result.deletedCount} record(s)`);
  }

  await mongoose.disconnect();
  console.log('[Clear] ✔  Done. Database connection closed.');
}

clear().catch((err) => {
  console.error('[Clear] ✖  Fatal error:', err.message);
  process.exit(1);
});
