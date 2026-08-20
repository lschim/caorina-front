import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password';
import { environment } from '../../environments/environment';

describe('ForgotPasswordComponent', () => {
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let component: ForgotPasswordComponent;
  let httpMock: HttpTestingController;

  function setup() {
    TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  function submit() {
    (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).click();
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('posts the email and shows a message that does not reveal whether the account exists', () => {
    setup();
    component.form.setValue({ email: 'forgot@tcm.fr' });
    fixture.detectChanges();

    submit();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/forgot-password`);
    expect(req.request.body).toEqual({ email: 'forgot@tcm.fr' });
    req.flush(null, { status: 204, statusText: 'No Content' });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain("Si un compte existe pour cette adresse, un email vient d'être envoyé.");
  });

  it('hides the form once the request succeeded', () => {
    setup();
    component.form.setValue({ email: 'forgot@tcm.fr' });
    fixture.detectChanges();

    submit();

    httpMock
      .expectOne(`${environment.apiBaseUrl}/auth/forgot-password`)
      .flush(null, { status: 204, statusText: 'No Content' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button[type="submit"]')).toBeFalsy();
  });

  it('shows a generic error and keeps the form when the request fails', () => {
    setup();
    component.form.setValue({ email: 'forgot@tcm.fr' });
    fixture.detectChanges();

    submit();

    httpMock
      .expectOne(`${environment.apiBaseUrl}/auth/forgot-password`)
      .flush({ message: 'boom' }, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Une erreur est survenue. Réessayez.');
    expect(fixture.nativeElement.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('makes no HTTP call when the email is empty', () => {
    setup();

    submit();

    httpMock.expectNone(`${environment.apiBaseUrl}/auth/forgot-password`);
  });

  it('shows a link back to the login screen', () => {
    setup();

    const link = fixture.nativeElement.querySelector('a[routerLink="/login"]') as HTMLAnchorElement;
    expect(link).toBeTruthy();
  });
});
