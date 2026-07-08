#!/bin/bash
# Seed the database with sample tasks
# Run from project root

DB_PATH="data/tasks.db"

if [ ! -f "$DB_PATH" ]; then
  echo "Creating database..."
  mkdir -p data
fi

echo "Seeding database with sample tasks..."

node -e "
const { createClient } = require('@libsql/client');
const path = require('path');

async function main() {
  const db = createClient({
    url: 'file:' + path.join(process.cwd(), 'data', 'tasks.db'),
    intMode: 'number',
  });

  await db.execute(\`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL DEFAULT 1,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
      due_date TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  \`);

  const tasks = [
    ['Buy groceries', 'Milk, eggs, bread, and cheese', 'low', null, 0],
    ['Finish presentation', 'Complete the Q3 slide deck for Monday', 'high', new Date(Date.now() + 86400000).toISOString().split('T')[0], 0],
    ['Reply to emails', '', 'medium', null, 0],
    ['Update dependencies', 'Run npm update and fix any breaking changes', 'medium', new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], 0],
    ['Read documentation', 'Review the Next.js App Router docs', 'low', null, 0],
    ['Fix login bug', 'Users report 500 error on login page', 'high', new Date(Date.now() + 86400000).toISOString().split('T')[0], 0],
    ['Write unit tests', 'Add tests for the task API routes', 'medium', new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], 0],
    ['Clean workspace', '', 'low', null, 1],
    ['Plan sprint', 'Set up the next sprint board and goals', 'high', new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], 0],
    ['Review PR #42', 'Code review for the dashboard feature', 'medium', null, 1],
  ];

  for (const t of tasks) {
    await db.execute({
      sql: 'INSERT INTO tasks (user_id, title, description, priority, due_date, completed) VALUES (?, ?, ?, ?, ?, ?)',
      args: [1, ...t],
    });
  }

  console.log('Inserted ' + tasks.length + ' sample tasks.');
  db.close();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
"

echo "Done!"
