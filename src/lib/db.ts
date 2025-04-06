
/**
 * Simple in-memory database for user management
 * Note: In a production environment, this would be replaced with a persistent database
 */
import { v4 as uuid } from "uuid";

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user" | "moderator";
  approved: boolean;
  createdAt: string;
}

// Initial admin user (created during system initialization)
const initialAdmin: User = {
  id: uuid(),
  username: "admin",
  email: "admin@example.com",
  // Default password: "admin123" (would be properly hashed in production)
  passwordHash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
  role: "admin",
  approved: true,
  createdAt: new Date().toISOString()
};

// In-memory database
class DB {
  private users: User[] = [initialAdmin];

  constructor() {
    // Load users from localStorage if available
    this.loadFromStorage();
  }

  // Save current state to localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem('authDB_users', JSON.stringify(this.users));
    } catch (error) {
      console.error("Failed to save users to localStorage:", error);
    }
  }

  // Load state from localStorage
  private loadFromStorage(): void {
    try {
      const savedUsers = localStorage.getItem('authDB_users');
      if (savedUsers) {
        this.users = JSON.parse(savedUsers);
      }
    } catch (error) {
      console.error("Failed to load users from localStorage:", error);
    }
  }

  // Get all users
  getUsers(): User[] {
    return [...this.users];
  }

  // Get user by ID
  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  // Get user by email
  getUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // Get user by username
  getUserByUsername(username: string): User | undefined {
    return this.users.find(user => user.username.toLowerCase() === username.toLowerCase());
  }

  // Create new user
  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...userData,
      id: uuid(),
      createdAt: new Date().toISOString()
    };
    
    this.users.push(newUser);
    this.saveToStorage();
    return newUser;
  }

  // Update user
  updateUser(id: string, userData: Partial<User>): User | undefined {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return undefined;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData
    };

    this.saveToStorage();
    return this.users[userIndex];
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
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    const deleted = initialLength > this.users.length;
    
    if (deleted) {
      this.saveToStorage();
    }
    
    return deleted;
  }
}

// Export a singleton instance
export const db = new DB();
