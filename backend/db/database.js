const Database = require('better-sqlite3');
const path = require('path');

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'auth.db'), { verbose: console.log });

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'user'
  )
`);

// Function to get or create user
function getOrCreateUser(userId) {
  const stmt = db.prepare('SELECT * FROM users WHERE user_id = ?');
  let user = stmt.get(userId);

  if (!user) {
    const insert = db.prepare('INSERT INTO users (user_id, role) VALUES (?, ?)');
    insert.run(userId, 'user');
    user = { user_id: userId, role: 'user' };
  }

  return user;
}

// Function to update user role
function updateUserRole(userId, role) {
  const stmt = db.prepare('UPDATE users SET role = ? WHERE user_id = ?');
  stmt.run(role, userId);
}

// Function to get all users
function getAllUsers() {
  const stmt = db.prepare('SELECT user_id, role FROM users');
  return stmt.all();
}

module.exports = { db, getOrCreateUser, updateUserRole, getAllUsers };