import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthApi } from '../core/auth/auth.api';
import { AuthService } from '../core/auth/auth.service';
import { LOGIN_LABELS } from '../core/i18n/login.labels';

interface ResendContext {
  email: string;
  reason: 'registered' | 'unverified';
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  private authApi = inject(AuthApi);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  readonly labels = LOGIN_LABELS;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  error = signal<string | null>(null);
  loading = signal(false);

  resendContext = signal<ResendContext | null>(null);
  resendLoading = signal(false);
  resendMessage = signal<string | null>(null);
  resendError = signal<string | null>(null);

  ngOnInit(): void {
    const { registered, email } = this.route.snapshot.queryParams;
    if (registered && email) {
      this.resendContext.set({ email, reason: 'registered' });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    const { email, password } = this.form.getRawValue();
    this.authService
      .login(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/drugs']);
        },
        error: (err) => {
          this.loading.set(false);
          if (err.status === 403) {
            this.resendContext.set({ email, reason: 'unverified' });
          } else {
            this.error.set(this.labels.invalidCredentialsError);
          }
        },
      });
  }

  resendVerification(): void {
    const context = this.resendContext();
    if (!context) return;
    this.resendLoading.set(true);
    this.resendMessage.set(null);
    this.resendError.set(null);
    this.authApi
      .resendVerification(context.email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.resendLoading.set(false);
          this.resendMessage.set(this.labels.resendSuccess);
        },
        error: () => {
          this.resendLoading.set(false);
          this.resendError.set(this.labels.resendError);
        },
      });
  }
}
