import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthApi } from '../core/auth/auth.api';
import { RESET_PASSWORD_LABELS } from '../core/i18n/reset-password.labels';
import { passwordsMatchValidator } from '../core/validators/passwords-match.validator';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordComponent implements OnInit {
  private authApi = inject(AuthApi);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  readonly labels = RESET_PASSWORD_LABELS;

  form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatchValidator('password', 'confirmPassword') },
  );

  state = signal<'form' | 'success' | 'invalidToken'>('form');
  error = signal<string | null>(null);
  loading = signal(false);
  submitted = signal(false);

  private token: string | null = null;

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.state.set('invalidToken');
      return;
    }
    this.token = token;
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid || !this.token) return;
    this.loading.set(true);
    this.error.set(null);
    const { password } = this.form.getRawValue();
    this.authApi
      .resetPassword(this.token, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.state.set('success');
        },
        error: (err: { status: number }) => {
          this.loading.set(false);
          if (err.status === 400) {
            this.state.set('invalidToken');
          } else {
            this.error.set(this.labels.genericError);
          }
        },
      });
  }
}
