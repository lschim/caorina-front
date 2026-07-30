import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HeaderComponent } from './header';
import { AuthService } from '../core/auth/auth.service';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceStub: { userRole: () => 'ADMIN' | 'USER' | null; logout: () => void };

  function setup(role: 'ADMIN' | 'USER' | null) {
    authServiceStub = { userRole: () => role, logout: () => {} };
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub as unknown as AuthService },
      ],
    });
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  }

  function openProfileMenu() {
    const trigger = fixture.nativeElement.querySelector(
      'button[aria-label="Menu du compte"]',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
  }

  it('always shows the Ingrédients and Formules links', () => {
    setup('USER');
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Ingrédients');
    expect(text).toContain('Formules');
  });

  it('hides "Gérer les utilisateurs" for a non-admin user', () => {
    setup('USER');
    openProfileMenu();
    expect(document.body.textContent ?? '').not.toContain('Gérer les utilisateurs');
  });

  it('shows "Gérer les utilisateurs" for an admin user', () => {
    setup('ADMIN');
    openProfileMenu();
    expect(document.body.textContent ?? '').toContain('Gérer les utilisateurs');
  });

  it('logs out and navigates to /login when "Déconnexion" is triggered', () => {
    setup('USER');
    const logoutSpy = vi.spyOn(authServiceStub, 'logout');
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance.logout();

    expect(logoutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
