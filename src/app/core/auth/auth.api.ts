import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AccountInfo, LoginResponse } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private http = inject(HttpClient);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, {
      email,
      password,
    });
  }

  me(): Observable<AccountInfo> {
    return this.http.get<AccountInfo>(`${environment.apiBaseUrl}/auth/me`);
  }

  register(email: string, password: string): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/auth/register`, {
      email,
      password,
    });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.patch<void>(`${environment.apiBaseUrl}/auth/password`, {
      currentPassword,
      newPassword,
    });
  }

  resendVerification(email: string): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/auth/resend-verification`, {
      email,
    });
  }
}
