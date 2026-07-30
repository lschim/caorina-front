export interface LoginResponse {
  token: string;
  role: 'ADMIN' | 'USER';
}

export interface AccountInfo {
  email: string;
  createdAt: string;
}
