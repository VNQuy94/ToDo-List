import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

// Detect environment
const isDocker = !existsSync(path.join(REPO_ROOT, 'backend'));
const backendPath = isDocker ? REPO_ROOT : path.join(REPO_ROOT, 'backend');
const MODELS_ROOT = path.join(backendPath, 'src', 'models');

// Load environment variables if running locally
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(backendPath, '.env') });
}

// Import backend model
const { default: Todo } = await import(path.join(MODELS_ROOT, 'todo.js'));

// Collection registry
const CLEAR_COLLECTIONS = [
  { name: 'Todo', model: Todo },
];

async function clear() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('[Clear] MONGO_URI is missing');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  for (const { name, model } of CLEAR_COLLECTIONS) {
    const result = await model.deleteMany({});
    console.log(`[Clear] ${name}: deleted ${result.deletedCount} record(s)`);
  }

  await mongoose.disconnect();
}

clear().catch((err) => {
  console.error('[Clear] Error:', err.message);
  process.exit(1);
});
