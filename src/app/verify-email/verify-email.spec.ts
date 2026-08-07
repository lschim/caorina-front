import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { VerifyEmailComponent } from './verify-email';
import { environment } from '../../environments/environment';

describe('VerifyEmailComponent', () => {
  let fixture: ComponentFixture<VerifyEmailComponent>;
  let httpMock: HttpTestingController;

  function setup(queryParams: Record<string, string> = {}) {
    TestBed.configureTestingModule({
      imports: [VerifyEmailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams } } },
      ],
    });
    fixture = TestBed.createComponent(VerifyEmailComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('shows an error and makes no HTTP call when the token is missing', () => {
    setup();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Lien invalide ou expiré.');
  });

  it('shows a success message and a login link when verification succeeds', () => {
    setup({ token: 'abc123' });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/verify-email?token=abc123`);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 204, statusText: 'No Content' });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Email vérifié !');
    const link = fixture.nativeElement.querySelector('a[routerLink="/login"]') as HTMLAnchorElement;
    expect(link).toBeTruthy();
  });

  it('shows an error message when the token is invalid or expired', () => {
    setup({ token: 'bad-token' });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/verify-email?token=bad-token`);
    req.flush({ message: 'lien invalide ou expiré' }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Lien invalide ou expiré.');
  });
});
