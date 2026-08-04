import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { RegisterComponent } from './register';
import { environment } from '../../environments/environment';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  function fillForm(
    overrides: Partial<{ email: string; password: string; confirmPassword: string }> = {},
  ) {
    component.form.setValue({
      email: overrides.email ?? 'new@tcm.fr',
      password: overrides.password ?? 'secret12',
      confirmPassword: overrides.confirmPassword ?? 'secret12',
    });
    fixture.detectChanges();
  }

  function submitButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
  }

  it('keeps the submit button disabled when the password is too short', () => {
    fillForm({ password: 'short', confirmPassword: 'short' });
    expect(submitButton().disabled).toBe(true);
  });

  it('keeps the submit button disabled when password and confirmation differ', () => {
    fillForm({ confirmPassword: 'different1' });
    expect(submitButton().disabled).toBe(true);
  });

  it('registers and navigates to /login with the registered flag and email', () => {
    fillForm({ email: 'new@tcm.fr' });
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    submitButton().click();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'new@tcm.fr', password: 'secret12' });
    req.flush(null, { status: 201, statusText: 'Created' });

    expect(navigateSpy).toHaveBeenCalledWith(['/login'], {
      queryParams: { registered: 1, email: 'new@tcm.fr' },
    });
  });

  it('shows an error message when the email is already used', () => {
    fillForm();
    submitButton().click();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/register`);
    req.flush({ message: 'cet email est déjà utilisé' }, { status: 409, statusText: 'Conflict' });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Cet email est déjà utilisé.');
  });

  it('shows a generic invalid-input message on a 400 response', () => {
    fillForm();
    submitButton().click();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/register`);
    req.flush({ message: 'format invalide' }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain("Format d'email ou mot de passe invalide");
  });

  it('shows a generic error message on an unexpected failure', () => {
    fillForm();
    submitButton().click();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/register`);
    req.flush({ message: 'boom' }, { status: 500, statusText: 'Internal Server Error' });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Une erreur est survenue. Réessayez.');
  });
});
