export interface LoginResponse {
    token: string;
    error?: string;
  }
  
  export interface SignupResponse {
    message: string;
    error?: string;
  }
  
  export interface User {
    userId: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
  }