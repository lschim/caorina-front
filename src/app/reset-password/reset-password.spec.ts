import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ResetPasswordComponent } from './reset-password';
import { environment } from '../../environments/environment';

describe('ResetPasswordComponent', () => {
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let component: ResetPasswordComponent;
  let httpMock: HttpTestingController;

  function setup(queryParams: Record<string, string> = {}) {
    TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams } } },
      ],
    });
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  function submit() {
    (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).click();
  }

  function fillPasswords(password: string, confirmPassword: string) {
    component.form.setValue({ password, confirmPassword });
    fixture.detectChanges();
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('shows an error and no form when the token is missing from the URL', () => {
    setup();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Lien invalide ou expiré.');
    expect(fixture.nativeElement.querySelector('button[type="submit"]')).toBeFalsy();
  });

  it('posts the token with the new password and shows a login link on success', () => {
    setup({ token: 'abc123' });
    fillPasswords('brandnew1', 'brandnew1');

    submit();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/reset-password`);
    expect(req.request.body).toEqual({ token: 'abc123', newPassword: 'brandnew1' });
    req.flush(null, { status: 204, statusText: 'No Content' });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Mot de passe réinitialisé !');
    expect(fixture.nativeElement.querySelector('a[routerLink="/login"]')).toBeTruthy();
  });

  it('offers a way to request a new link when the token is rejected', () => {
    setup({ token: 'expired-token' });
    fillPasswords('brandnew1', 'brandnew1');

    submit();

    httpMock
      .expectOne(`${environment.apiBaseUrl}/auth/reset-password`)
      .flush({ message: 'lien invalide ou expiré' }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Lien invalide ou expiré.');
    expect(fixture.nativeElement.querySelector('a[routerLink="/forgot-password"]')).toBeTruthy();
  });

  it('makes no HTTP call when the two passwords differ', () => {
    setup({ token: 'abc123' });
    fillPasswords('brandnew1', 'different1');

    submit();
    fixture.detectChanges();

    httpMock.expectNone(`${environment.apiBaseUrl}/auth/reset-password`);
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Les mots de passe ne correspondent pas.');
  });

  it('makes no HTTP call when the password is shorter than 8 characters', () => {
    setup({ token: 'abc123' });
    fillPasswords('short', 'short');

    submit();

    httpMock.expectNone(`${environment.apiBaseUrl}/auth/reset-password`);
  });

  it('shows a generic error when the server fails unexpectedly', () => {
    setup({ token: 'abc123' });
    fillPasswords('brandnew1', 'brandnew1');

    submit();

    httpMock
      .expectOne(`${environment.apiBaseUrl}/auth/reset-password`)
      .flush({ message: 'boom' }, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Une erreur est survenue. Réessayez.');
  });
});
