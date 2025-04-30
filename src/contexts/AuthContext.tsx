
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the user type
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the authentication context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isVerifying: boolean;
  userToVerify: { email: string; password: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUserToVerify: (user: { email: string; password: string } | null) => void;
  verifyAndLogin: (code: string) => Promise<boolean>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample user database
const USERS_DB = [
  {
    id: '1',
    name: 'Amit',
    email: 'amitignou1987@gmail.com',
    password: 'password123',
  },
  {
    id: '2',
    name: 'Lalit',
    email: 'buntydon4ug@gmail.com',
    password: 'password123',
  },
];

// Authentication provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userToVerify, setUserToVerify] = useState<{ email: string; password: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call to validate credentials
    const foundUser = USERS_DB.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (foundUser) {
      // Set the user to verify and start verification process
      setUserToVerify({ email, password });
      setIsVerifying(true);
      
      console.log('User found, proceeding to verification step:', email);
      return true;
    }
    
    console.log('Invalid credentials for:', email);
    return false;
  };

  // Verify email and complete login
  const verifyAndLogin = async (code: string): Promise<boolean> => {
    if (!userToVerify) return false;
    
    // In a real app, you would validate the code against what was sent to the user's email
    // For demo purposes, we'll accept "123456" as a valid code
    if (code === '123456') {
      const foundUser = USERS_DB.find(u => u.email.toLowerCase() === userToVerify.email.toLowerCase());
      
      if (foundUser) {
        // Create user object without password
        const loggedInUser = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
        };
        
        // Set user in state and localStorage
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        setIsVerifying(false);
        setUserToVerify(null);
        
        console.log('User verified and logged in:', loggedInUser.email);
        return true;
      }
    }
    
    console.log('Verification failed');
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    console.log('User logged out');
  };
  
  // Value to be provided by the context
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isVerifying,
    userToVerify,
    login,
    logout,
    setUserToVerify,
    verifyAndLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
