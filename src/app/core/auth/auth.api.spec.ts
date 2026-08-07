import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthApi } from './auth.api';
import { environment } from '../../../environments/environment';

describe('AuthApi', () => {
  let api: AuthApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(AuthApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('posts to /auth/register with the email and password', () => {
    api.register('new@tcm.fr', 'secret12').subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'new@tcm.fr', password: 'secret12' });
    req.flush(null);
  });

  it('posts to /auth/resend-verification with the email', () => {
    api.resendVerification('new@tcm.fr').subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/resend-verification`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'new@tcm.fr' });
    req.flush(null);
  });

  it('gets /auth/verify-email with the token as a query param', () => {
    api.verifyEmail('abc123').subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/verify-email?token=abc123`);
    expect(req.request.method).toBe('GET');
    req.flush(null);
  });
});
