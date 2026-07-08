#!/bin/bash
# Seed the database with sample tasks
# Run from project root

DB_PATH="data/tasks.db"

if [ ! -f "$DB_PATH" ]; then
  echo "Creating database..."
  # The app will create it on first request; just touch the file to ensure dir exists
  mkdir -p data
fi

echo "Seeding database with sample tasks..."

node -e "
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(process.cwd(), 'data', 'tasks.db'));
db.pragma('journal_mode = WAL');

// Ensure schema exists
db.exec(\`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
    due_date TEXT,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
\`);

const stmt = db.prepare('INSERT INTO tasks (title, description, priority, due_date, completed) VALUES (?, ?, ?, ?, ?)');

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

const insertMany = db.transaction(() => {
  for (const t of tasks) {
    stmt.run(...t);
  }
});

insertMany();

console.log(\`Inserted \${tasks.length} sample tasks.\`);
db.close();
"

echo "Done!"
