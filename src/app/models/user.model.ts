export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin'
}

export interface User {
  id: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

