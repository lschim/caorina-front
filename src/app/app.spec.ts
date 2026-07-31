import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { AuthService } from './core/auth/auth.service';

describe('App', () => {
  function setup(isLoggedIn: boolean) {
    const authServiceStub = {
      isLoggedIn: () => isLoggedIn,
      userRole: () => null,
      logout: () => undefined,
    };
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub as unknown as AuthService },
      ],
    });
  }

  it('should create the app', () => {
    setup(false);
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('does not render the header when logged out', () => {
    setup(false);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-header')).toBeNull();
  });

  it('renders the header when logged in', () => {
    setup(true);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-header')).not.toBeNull();
  });
});
