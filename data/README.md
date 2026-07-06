# data/

This directory contains static data assets for the monorepo.

## Structure

```
data/
└── seed/
    └── todos.json    ← Seed records for the Todo collection
```

## Seed Data Rules

- Only include **business fields** (`title`, `completed`, etc.)
- Do **NOT** include: `_id`, `createdAt`, `updatedAt`, `__v`
- Mongoose handles timestamps and IDs automatically on insert

## Adding a New Collection

1. Create `data/seed/<collection>.json` with an array of objects
2. Import the corresponding Mongoose model in `scripts/seed.js`
3. Register it in the `SEED_COLLECTIONS` array:

```js
const SEED_COLLECTIONS = [
  {
    name: 'Todo',
    model: Todo,
    dataPath: new URL('../data/seed/todos.json', import.meta.url),
  },
  // Add new entries here
];
```

## Running Seed Scripts

```bash
# From the repository root
pnpm seed          # Delete existing records and insert seed data
pnpm seed:clear    # Delete all records from all seeded collections
pnpm seed:reset    # Equivalent to seed:clear followed by seed
```
