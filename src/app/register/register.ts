import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthApi } from '../core/auth/auth.api';
import { REGISTER_LABELS } from '../core/i18n/register.labels';
import { passwordsMatchValidator } from '../core/validators/passwords-match.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private authApi = inject(AuthApi);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  readonly labels = REGISTER_LABELS;

  form = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatchValidator('password', 'confirmPassword') },
  );

  error = signal<string | null>(null);
  loading = signal(false);

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    const { email, password } = this.form.getRawValue();
    this.authApi
      .register(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/login'], { queryParams: { registered: 1, email } });
        },
        error: (err: { status: number }) => {
          this.loading.set(false);
          if (err.status === 409) {
            this.error.set(this.labels.emailAlreadyUsedError);
          } else if (err.status === 400) {
            this.error.set(this.labels.invalidError);
          } else {
            this.error.set(this.labels.genericError);
          }
        },
      });
  }
}
