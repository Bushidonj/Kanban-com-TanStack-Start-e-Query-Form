export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  message: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  message: string;
}
