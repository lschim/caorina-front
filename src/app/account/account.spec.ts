import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Account } from './account';
import { environment } from '../../environments/environment';

describe('Account', () => {
  let fixture: ComponentFixture<Account>;
  let component: Account;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Account],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Account);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/me`);
    req.flush({ email: 'test@tcm.fr', createdAt: '2026-01-15T00:00:00' });
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('displays the account email', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('test@tcm.fr');
  });

  it('keeps the submit button disabled when the new password is too short', () => {
    component.form.setValue({
      currentPassword: 'secret',
      newPassword: 'short',
      confirmPassword: 'short',
    });
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('keeps the submit button disabled when new and confirm passwords differ', () => {
    component.form.setValue({
      currentPassword: 'secret',
      newPassword: 'newSecret1',
      confirmPassword: 'different1',
    });
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('submits the change-password request and shows a success message', () => {
    component.form.setValue({
      currentPassword: 'secret',
      newPassword: 'newSecret1',
      confirmPassword: 'newSecret1',
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    button.click();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/password`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ currentPassword: 'secret', newPassword: 'newSecret1' });
    req.flush(null);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Mot de passe changé avec succès.');
  });

  it('shows an error message when the current password is wrong', () => {
    component.form.setValue({
      currentPassword: 'wrong',
      newPassword: 'newSecret1',
      confirmPassword: 'newSecret1',
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    button.click();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/password`);
    req.flush({ message: 'mot de passe actuel incorrect' }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Mot de passe actuel incorrect.');
  });
});
