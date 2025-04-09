
/**
 * SQLite-based database for user management
 */
import Database from 'better-sqlite3';
import { v4 as uuid } from "uuid";
import path from 'path';
import fs from 'fs';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user" | "moderator";
  approved: boolean;
  createdAt: string;
}

// Make sure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'auth.db');
// Renamed from 'db' to 'dbConnection' to avoid naming conflict
const dbConnection = new Database(dbPath);

// Initialize database with tables if they don't exist
dbConnection.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    passwordHash TEXT,
    role TEXT,
    approved INTEGER,
    createdAt TEXT
  )
`);

// Initial admin user (created during system initialization)
const defaultAdmin = {
  id: uuid(),
  username: "admin",
  email: "admin@example.com",
  // Default password: "admin123" (would be properly hashed in production)
  passwordHash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
  role: "admin",
  approved: 1,
  createdAt: new Date().toISOString()
};

// Check if admin user exists, if not create it
const adminCheck = dbConnection.prepare('SELECT * FROM users WHERE role = ?').get('admin');
if (!adminCheck) {
  dbConnection.prepare(`
    INSERT INTO users (id, username, email, passwordHash, role, approved, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    defaultAdmin.id,
    defaultAdmin.username,
    defaultAdmin.email,
    defaultAdmin.passwordHash,
    defaultAdmin.role,
    defaultAdmin.approved,
    defaultAdmin.createdAt
  );
}

// Database operations class
class DB {
  // Get all users
  getUsers(): User[] {
    const rows = dbConnection.prepare('SELECT * FROM users').all();
    return rows.map(row => ({
      ...row,
      approved: Boolean(row.approved)
    })) as User[];
  }

  // Get user by ID
  getUserById(id: string): User | undefined {
    const row = dbConnection.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!row) return undefined;
    return {
      ...row,
      approved: Boolean(row.approved)
    } as User;
  }

  // Get user by email
  getUserByEmail(email: string): User | undefined {
    const row = dbConnection.prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE').get(email);
    if (!row) return undefined;
    return {
      ...row,
      approved: Boolean(row.approved)
    } as User;
  }

  // Get user by username
  getUserByUsername(username: string): User | undefined {
    const row = dbConnection.prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE').get(username);
    if (!row) return undefined;
    return {
      ...row,
      approved: Boolean(row.approved)
    } as User;
  }

  // Create new user
  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...userData,
      id: uuid(),
      createdAt: new Date().toISOString()
    };
    
    dbConnection.prepare(`
      INSERT INTO users (id, username, email, passwordHash, role, approved, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      newUser.id,
      newUser.username,
      newUser.email,
      newUser.passwordHash,
      newUser.role,
      newUser.approved ? 1 : 0,
      newUser.createdAt
    );
    
    return newUser;
  }

  // Update user
  updateUser(id: string, userData: Partial<User>): User | undefined {
    const existingUser = this.getUserById(id);
    if (!existingUser) return undefined;

    const updatedUser = {
      ...existingUser,
      ...userData
    };

    dbConnection.prepare(`
      UPDATE users 
      SET username = ?, email = ?, passwordHash = ?, role = ?, approved = ?
      WHERE id = ?
    `).run(
      updatedUser.username,
      updatedUser.email,
      updatedUser.passwordHash,
      updatedUser.role,
      updatedUser.approved ? 1 : 0,
      id
    );

    return updatedUser;
  }

  // Approve user
  approveUser(id: string): User | undefined {
    return this.updateUser(id, { approved: true });
  }

  // Update user role
  updateUserRole(id: string, role: User['role']): User | undefined {
    return this.updateUser(id, { role });
  }

  // Delete user
  deleteUser(id: string): boolean {
    const result = dbConnection.prepare('DELETE FROM users WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

// Export a singleton instance
export const db = new DB();
