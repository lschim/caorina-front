import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { LoginComponent } from './login';
import { environment } from '../../environments/environment';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let httpMock: HttpTestingController;

  function setup(queryParams: Record<string, string> = {}) {
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams } } },
      ],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  function findResendButton(): HTMLButtonElement {
    return Array.from(fixture.nativeElement.querySelectorAll('button')).find((b) =>
      (b as HTMLButtonElement).textContent?.includes("Renvoyer l'email de vérification"),
    ) as HTMLButtonElement;
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('shows a link to create an account', () => {
    setup();
    const link = fixture.nativeElement.querySelector(
      'a[routerLink="/register"]',
    ) as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.textContent).toContain('Créer un compte');
  });

  it('shows an error message on invalid credentials', () => {
    setup();
    component.form.setValue({ email: 'test@tcm.fr', password: 'wrong' });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    button.click();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
    req.flush({ message: 'bad credentials' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Email ou mot de passe incorrect.');
  });

  it('shows the registered banner and resend button from query params', () => {
    setup({ registered: '1', email: 'new@tcm.fr' });

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Compte créé. Un email de vérification a été envoyé à new@tcm.fr.');
    expect(text).toContain("Renvoyer l'email de vérification");
  });

  it('shows the unverified banner when login fails with 403', () => {
    setup();
    component.form.setValue({ email: 'unverified@tcm.fr', password: 'secret12' });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    button.click();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
    req.flush({ message: 'email not verified' }, { status: 403, statusText: 'Forbidden' });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Adresse email non vérifiée.');
    expect(text).toContain("Renvoyer l'email de vérification");
  });

  it('shows a success message after resending the verification email', () => {
    setup({ registered: '1', email: 'new@tcm.fr' });

    findResendButton().click();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/resend-verification`);
    expect(req.request.body).toEqual({ email: 'new@tcm.fr' });
    req.flush(null, { status: 204, statusText: 'No Content' });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Email de vérification renvoyé.');
  });

  it('shows a generic error message when resending fails', () => {
    setup({ registered: '1', email: 'new@tcm.fr' });

    findResendButton().click();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/resend-verification`);
    req.flush({ message: 'cooldown' }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain("Impossible de renvoyer l'email pour le moment. Réessayez plus tard.");
  });
});
