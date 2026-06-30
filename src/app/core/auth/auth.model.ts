export interface LoginResponse {
  token: string;
  role: 'ADMIN' | 'USER';
}
