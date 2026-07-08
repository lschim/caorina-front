import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CreateUserRequest {
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
}

export interface UserDto {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class UserApi {
  private http = inject(HttpClient);

  createUser(req: CreateUserRequest): Observable<UserDto> {
    return this.http.post<UserDto>(`${environment.apiBaseUrl}/admin/users`, req);
  }
}
