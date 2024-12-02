export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

// Mock user storage
const mockUsers: User[] = [];

export const signup = async (data: SignupData): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if user already exists
  const existingUser = mockUsers.find(user => user.email === data.email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Create new user
  const newUser: User = {
    id: mockUsers.length + 1,
    username: data.username,
    email: data.email,
  };

  mockUsers.push(newUser);
  return newUser;
};

export const login = async (data: LoginData): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock successful login with dummy user data
  const mockUser: User = {
    id: 1,
    username: 'Demo User',
    email: data.email,
  };

  return mockUser;
};

// Mock function to check if user is logged in
export const checkAuth = async (): Promise<User | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // For demo purposes, always return logged out state
  return null;
};

// Mock function to logout
export const logout = async (): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Nothing to do in mock implementation
  return;
};
