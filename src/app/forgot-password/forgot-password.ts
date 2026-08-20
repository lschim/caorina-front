import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthApi } from '../core/auth/auth.api';
import { FORGOT_PASSWORD_LABELS } from '../core/i18n/forgot-password.labels';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
  private authApi = inject(AuthApi);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  readonly labels = FORGOT_PASSWORD_LABELS;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  sent = signal(false);
  error = signal<string | null>(null);
  loading = signal(false);

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    const { email } = this.form.getRawValue();
    this.authApi
      .forgotPassword(email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          // Deliberately the same outcome whether or not the account exists — the backend answers
          // 204 in both cases, and the UI must not narrow that down.
          this.sent.set(true);
        },
        error: () => {
          this.loading.set(false);
          this.error.set(this.labels.genericError);
        },
      });
  }
}
