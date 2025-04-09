
/**
 * Browser-compatible database for user management using IndexedDB
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

// IndexedDB database manager class
class DB {
  private dbName = 'auth_db';
  private dbVersion = 1;
  private dbReady: Promise<IDBDatabase>;
  private userData: User[] = [];
  
  constructor() {
    // Initialize the database
    this.dbReady = this.initDB();
    
    // Load the users on initialization
    this.dbReady.then(() => {
      this.loadUsers().then(users => {
        this.userData = users;
        
        // Add default admin if no users exist
        if (this.userData.length === 0) {
          this.createDefaultAdmin();
        }
      });
    });
  }
  
  // Initialize the IndexedDB database
  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create the users object store if it doesn't exist
        if (!db.objectStoreNames.contains('users')) {
          const store = db.createObjectStore('users', { keyPath: 'id' });
          store.createIndex('username', 'username', { unique: true });
          store.createIndex('email', 'email', { unique: true });
          store.createIndex('role', 'role', { unique: false });
        }
      };
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };
      
      request.onerror = (event) => {
        console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }
  
  // Create a transaction and get the users store
  private async getUsersStore(mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    const db = await this.dbReady;
    const transaction = db.transaction('users', mode);
    return transaction.objectStore('users');
  }
  
  // Load all users from the database
  private async loadUsers(): Promise<User[]> {
    return new Promise(async (resolve) => {
      const store = await this.getUsersStore();
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error('Error loading users:', request.error);
        resolve([]);
      };
    });
  }
  
  // Create the default admin user
  private async createDefaultAdmin() {
    const defaultAdmin: User = {
      id: uuid(),
      username: "admin",
      email: "admin@example.com",
      // Default password: "admin123" (would be properly hashed in production)
      passwordHash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
      role: "admin",
      approved: true,
      createdAt: new Date().toISOString()
    };
    
    await this.createUser(defaultAdmin);
  }
  
  // Get all users
  async getUsers(): Promise<User[]> {
    await this.dbReady;
    return this.userData;
  }
  
  // Get user by ID
  async getUserById(id: string): Promise<User | undefined> {
    await this.dbReady;
    return this.userData.find(user => user.id === id);
  }
  
  // Get user by email (case insensitive)
  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.dbReady;
    return this.userData.find(user => 
      user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  // Get user by username (case insensitive)
  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.dbReady;
    return this.userData.find(user => 
      user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  // Create new user
  async createUser(userData: User | Omit<User, 'id' | 'createdAt'>): Promise<User> {
    await this.dbReady;
    
    // Ensure the user has an ID and createdAt timestamp
    const newUser: User = ('id' in userData) 
      ? userData as User 
      : {
          ...userData as Omit<User, 'id' | 'createdAt'>,
          id: uuid(),
          createdAt: new Date().toISOString()
        };
    
    // Add to IndexedDB
    const store = await this.getUsersStore('readwrite');
    const request = store.add(newUser);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        // Add to local cache
        this.userData.push(newUser);
        resolve(newUser);
      };
      
      request.onerror = () => {
        console.error('Error creating user:', request.error);
        reject(request.error);
      };
    });
  }
  
  // Update user
  async updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
    await this.dbReady;
    
    const existingIndex = this.userData.findIndex(user => user.id === id);
    if (existingIndex === -1) return undefined;
    
    const existingUser = this.userData[existingIndex];
    const updatedUser = {
      ...existingUser,
      ...userData
    };
    
    // Update in IndexedDB
    const store = await this.getUsersStore('readwrite');
    const request = store.put(updatedUser);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        // Update local cache
        this.userData[existingIndex] = updatedUser;
        resolve(updatedUser);
      };
      
      request.onerror = () => {
        console.error('Error updating user:', request.error);
        reject(request.error);
      };
    });
  }
  
  // Approve user
  async approveUser(id: string): Promise<User | undefined> {
    return this.updateUser(id, { approved: true });
  }
  
  // Update user role
  async updateUserRole(id: string, role: User['role']): Promise<User | undefined> {
    return this.updateUser(id, { role });
  }
  
  // Delete user
  async deleteUser(id: string): Promise<boolean> {
    await this.dbReady;
    
    const existingIndex = this.userData.findIndex(user => user.id === id);
    if (existingIndex === -1) return false;
    
    // Delete from IndexedDB
    const store = await this.getUsersStore('readwrite');
    const request = store.delete(id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        // Remove from local cache
        this.userData.splice(existingIndex, 1);
        resolve(true);
      };
      
      request.onerror = () => {
        console.error('Error deleting user:', request.error);
        resolve(false);
      };
    });
  }
}

// Export a singleton instance
export const db = new DB();
