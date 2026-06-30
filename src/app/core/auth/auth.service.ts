import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthApi } from './auth.api';
import { LoginResponse } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'auth_role';

  private authApi = inject(AuthApi);

  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  private _role = signal<'ADMIN' | 'USER' | null>(
    localStorage.getItem(this.ROLE_KEY) as 'ADMIN' | 'USER' | null,
  );

  readonly token = this._token.asReadonly();
  readonly userRole = this._role.asReadonly();
  readonly isLoggedIn = computed(() => this._token() !== null);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.authApi.login(email, password).pipe(
      tap((response) => {
        this._token.set(response.token);
        this._role.set(response.role);
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.ROLE_KEY, response.role);
      }),
    );
  }

  logout(): void {
    this._token.set(null);
    this._role.set(null);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }
}
