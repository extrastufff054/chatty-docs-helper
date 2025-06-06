
/**
 * Authentication utilities for the application
 */
import { db, User } from "./db";

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: string; // ISO string
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

// Simple in-memory sessions storage
class AuthManager {
  private sessions: Record<string, AuthSession> = {};
  
  constructor() {
    this.loadSessionsFromStorage();
  }
  
  // Hash a password (simplified version - use bcrypt in production)
  async hashPassword(password: string): Promise<string> {
    // Simple SHA-256 hash for demo purposes
    // In production, use a proper password hashing library like bcrypt
    return this.sha256(password);
  }
  
  // Simple SHA-256 implementation for demo purposes
  private async sha256(message: string): Promise<string> {
    // Create a new TextEncoder to convert the string to UTF-8 bytes
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    // Use the SubtleCrypto API to hash the data
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert the hash to a hex string
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  
  // Generate a session token
  private generateToken(): string {
    return crypto.randomUUID();
  }
  
  // Save sessions to localStorage
  private saveSessionsToStorage(): void {
    try {
      localStorage.setItem('auth_sessions', JSON.stringify(this.sessions));
    } catch (error) {
      console.error("Failed to save sessions to localStorage:", error);
    }
  }
  
  // Load sessions from localStorage
  private loadSessionsFromStorage(): void {
    try {
      const savedSessions = localStorage.getItem('auth_sessions');
      if (savedSessions) {
        this.sessions = JSON.parse(savedSessions);
      }
    } catch (error) {
      console.error("Failed to load sessions from localStorage:", error);
    }
  }
  
  // Create user account
  async signup(data: SignupData): Promise<{ success: boolean; error?: string }> {
    // Check if username already exists
    const existingUsername = await db.getUserByUsername(data.username);
    if (existingUsername) {
      return { success: false, error: "Username already exists" };
    }
    
    // Check if email already exists
    const existingEmail = await db.getUserByEmail(data.email);
    if (existingEmail) {
      return { success: false, error: "Email already exists" };
    }
    
    // Hash the password
    const passwordHash = await this.hashPassword(data.password);
    
    // Create the user with "user" role and not approved by default
    await db.createUser({
      username: data.username,
      email: data.email,
      passwordHash,
      role: "user",
      approved: false
    });
    
    return { success: true };
  }
  
  // User login
  async login(credentials: LoginCredentials): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    // Find user by username
    const user = await db.getUserByUsername(credentials.username);
    
    if (!user) {
      return { success: false, error: "Invalid username or password" };
    }
    
    // Check password
    const passwordHash = await this.hashPassword(credentials.password);
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: "Invalid username or password" };
    }
    
    // Check if user is approved
    if (!user.approved) {
      return { success: false, error: "Account is pending approval by an administrator" };
    }
    
    // Create session
    const token = this.generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    
    const session: AuthSession = {
      token,
      user,
      expiresAt: expiresAt.toISOString()
    };
    
    this.sessions[token] = session;
    this.saveSessionsToStorage();
    
    return { success: true, session };
  }
  
  // Validate a session
  async validateSession(token: string): Promise<{ valid: boolean; session?: AuthSession }> {
    const session = this.sessions[token];
    
    if (!session) {
      return { valid: false };
    }
    
    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    
    if (now > expiresAt) {
      this.logout(token);
      return { valid: false };
    }
    
    // Check if user still exists and is approved
    const user = await db.getUserById(session.user.id);
    if (!user || !user.approved) {
      this.logout(token);
      return { valid: false };
    }
    
    // Update session with latest user data
    session.user = user;
    
    return { valid: true, session };
  }
  
  // Logout (invalidate session)
  logout(token: string): boolean {
    const exists = !!this.sessions[token];
    
    if (exists) {
      delete this.sessions[token];
      this.saveSessionsToStorage();
    }
    
    return exists;
  }
  
  // Admin token login (special case for backward compatibility)
  async loginWithAdminToken(adminToken: string): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    // Validate that the token matches the expected admin token
    const expectedToken = localStorage.getItem('expectedAdminToken') || '';
    
    if (!adminToken || adminToken !== expectedToken) {
      return { success: false, error: "Invalid admin token" };
    }
    
    // Find admin user
    const users = await db.getUsers();
    const adminUser = users.find(user => user.role === 'admin');
    
    if (!adminUser) {
      return { success: false, error: "No admin user found" };
    }
    
    // Create session
    const token = this.generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // 1 day from now
    
    const session: AuthSession = {
      token,
      user: adminUser,
      expiresAt: expiresAt.toISOString()
    };
    
    this.sessions[token] = session;
    this.saveSessionsToStorage();
    
    return { success: true, session };
  }
  
  // Current session management (for React components)
  private currentSession: AuthSession | null = null;
  
  getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }
  
  setCurrentSession(session: AuthSession | null): void {
    this.currentSession = session;
    
    // Store in localStorage for persistence
    if (session) {
      localStorage.setItem('currentSessionToken', session.token);
    } else {
      localStorage.removeItem('currentSessionToken');
    }
  }
  
  // Check if user has specific role
  async hasRole(role: User['role'], token?: string): Promise<boolean> {
    let session: AuthSession | undefined;
    
    if (token) {
      const validation = await this.validateSession(token);
      if (validation.valid && validation.session) {
        session = validation.session;
      }
    } else if (this.currentSession) {
      const validation = await this.validateSession(this.currentSession.token);
      if (validation.valid && validation.session) {
        session = validation.session;
      }
    }
    
    return !!session && session.user.role === role;
  }
}

// Export a singleton instance
export const auth = new AuthManager();
