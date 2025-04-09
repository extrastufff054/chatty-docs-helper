# Authentication System Guide

This guide provides in-depth information about the authentication system in the I4C Chatbot, explaining implementation details, security considerations, and customization options.

## Authentication Architecture

The I4C Chatbot uses a token-based authentication system with the following components:

1. **User Storage**: IndexedDB for browser-based storage of user accounts
2. **Session Management**: In-memory and localStorage-persisted sessions
3. **Password Security**: SHA-256 hashing (with recommendations for production-grade security)
4. **Role-Based Access**: Admin, Moderator, and User role support
5. **Approval Workflow**: New users require administrator approval

## Implementation Details

### User Data Model

```typescript
interface User {
  id: string;                             // Unique identifier
  username: string;                       // Unique username
  email: string;                          // Unique email address
  passwordHash: string;                   // Hashed password
  role: "admin" | "user" | "moderator";   // User role
  approved: boolean;                      // Approval status
  createdAt: string;                      // Creation timestamp
}
```

### Session Data Model

```typescript
interface AuthSession {
  token: string;       // Session token (UUID)
  user: User;          // User object
  expiresAt: string;   // Expiration timestamp
}
```

### Authentication Flow

1. **Registration**:
   - User submits registration form
   - System validates input and checks for duplicates
   - Password is hashed
   - User is created with `approved: false`
   - Admin must approve before user can log in

2. **Login**:
   - User submits credentials
   - System validates username/password
   - If valid and approved, session is created
   - Session token is stored in localStorage
   - User is redirected to main application

3. **Session Validation**:
   - On application load, stored token is checked
   - If valid, user session is restored
   - If expired or invalid, user must login again

4. **Logout**:
   - Session token is invalidated
   - Token is removed from localStorage
   - User is redirected to login page

## Security Considerations

### Current Implementation

The current implementation uses:
- SHA-256 for password hashing
- UUID v4 for session tokens
- 7-day token expiration
- In-browser IndexedDB for data storage

### Production Recommendations

For production environments, enhance security with:

1. **Improved Password Hashing**:
   ```typescript
   // Example using bcrypt (requires backend)
   async function hashPassword(password: string): Promise<string> {
     const saltRounds = 12;
     return await bcrypt.hash(password, saltRounds);
   }
   
   async function verifyPassword(password: string, hash: string): Promise<boolean> {
     return await bcrypt.compare(password, hash);
   }
   ```

2. **Enhanced Session Security**:
   - Shorter session timeouts (1 day recommended)
   - Implement refresh tokens
   - Add IP binding for sessions
   - Use secure, HTTP-only cookies instead of localStorage

3. **Two-Factor Authentication**:
   ```typescript
   interface User {
     // ... existing fields
     twoFactorEnabled: boolean;
     twoFactorSecret?: string;
   }
   
   // Implementation would require a backend service
   async function verifyTwoFactor(user: User, token: string): Promise<boolean> {
     if (!user.twoFactorEnabled) return true;
     return twoFactorService.verify(user.twoFactorSecret, token);
   }
   ```

## Customizing the Authentication System

### Adding Custom Fields

To add custom user fields:

1. Update the `User` interface in `lib/db.ts`:
   ```typescript
   interface User {
     // ... existing fields
     customField: string;
   }
   ```

2. Update the database schema in `lib/db.ts`:
   ```typescript
   // For an SQL-based system, update the CREATE TABLE statement
   // For IndexedDB, no schema change is needed, just include the new field
   ```

3. Update user creation and update methods

### Implementing OAuth Providers

To add OAuth authentication (e.g., Google, GitHub):

1. Create OAuth provider interfaces:
   ```typescript
   interface OAuthProvider {
     name: string;
     authorize(): Promise<void>;
     handleCallback(code: string): Promise<OAuthUserInfo>;
   }
   
   interface OAuthUserInfo {
     id: string;
     email: string;
     name: string;
     // Other provider-specific fields
   }
   ```

2. Implement provider-specific logic
3. Add OAuth user linking to the database schema
4. Update login workflow to support multiple auth methods

### Custom Approval Workflows

For more complex approval workflows:

1. Extend the user schema:
   ```typescript
   interface User {
     // ... existing fields
     approvalStatus: "pending" | "approved" | "rejected" | "suspended";
     approvedBy?: string;
     approvedAt?: string;
     // Additional workflow fields
   }
   ```

2. Implement approval logic with multiple stages
3. Add notification system for approval status changes

## Troubleshooting Common Issues

### Login Issues

1. **Unable to Login with Correct Credentials**:
   - **Possible Cause**: User not approved or IndexedDB storage issues
   - **Resolution**: Check user approval status and browser storage permissions

2. **Session Unexpectedly Expires**:
   - **Possible Cause**: Token expiry or storage cleared
   - **Resolution**: Verify expiration calculation and storage persistence

3. **Multiple Sessions Conflict**:
   - **Possible Cause**: Multiple tabs or devices using same account
   - **Resolution**: Implement better session tracking with last-active timestamps

### Database Issues

1. **IndexedDB Permission Errors**:
   - **Possible Cause**: Browser privacy settings or incognito mode
   - **Resolution**: Check browser console for specific errors; inform users about storage requirements

2. **Data Persistence Problems**:
   - **Possible Cause**: Browser storage limits or clearing
   - **Resolution**: Implement graceful fallback and clear error messages

### User Management Issues

1. **Unable to Create New Users**:
   - **Possible Cause**: Unique constraint violations or validation errors
   - **Resolution**: Improve error handling and validation feedback

2. **Role Changes Not Taking Effect**:
   - **Possible Cause**: Session caching old role information
   - **Resolution**: Force session refresh after role changes

## Advanced Authentication Features

### Implementing Password Policies

```typescript
interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventCommonPasswords: boolean;
}

function validatePassword(password: string, policy: PasswordPolicy): boolean {
  if (password.length < policy.minLength) return false;
  if (policy.requireUppercase && !/[A-Z]/.test(password)) return false;
  if (policy.requireLowercase && !/[a-z]/.test(password)) return false;
  if (policy.requireNumbers && !/[0-9]/.test(password)) return false;
  if (policy.requireSpecialChars && !/[^A-Za-z0-9]/.test(password)) return false;
  
  // Common password check would require a list or service
  
  return true;
}
```

### Session Management Strategies

For better session management:

1. **Sliding Expiration**:
   ```typescript
   function extendSession(session: AuthSession): AuthSession {
     const expiresAt = new Date();
     expiresAt.setDate(expiresAt.getDate() + 7); // sliding window
     
     return {
       ...session,
       expiresAt: expiresAt.toISOString()
     };
   }
   ```

2. **Device Tracking**:
   ```typescript
   interface AuthSession {
     // ... existing fields
     deviceInfo: {
       browser: string;
       os: string;
       ip: string;
       lastActive: string;
     }
   }
   ```

3. **Session Scoping**:
   ```typescript
   interface AuthSession {
     // ... existing fields
     scope: "full" | "readonly" | "api";
   }
   ```

This authentication guide provides a comprehensive overview of the system's capabilities, security considerations, and customization options. Use it as a reference when implementing, maintaining, or extending the authentication system.
