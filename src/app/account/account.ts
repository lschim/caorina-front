import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthApi } from '../core/auth/auth.api';
import { AccountInfo } from '../core/auth/auth.model';
import { ACCOUNT_LABELS } from '../core/i18n/account.labels';
import { passwordsMatchValidator } from '../core/validators/passwords-match.validator';

@Component({
  selector: 'app-account',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {
  private authApi = inject(AuthApi);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  readonly labels = ACCOUNT_LABELS;

  accountInfo = signal<AccountInfo | null>(null);

  form = this.fb.nonNullable.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatchValidator('newPassword', 'confirmPassword') },
  );

  error = signal<string | null>(null);
  loading = signal(false);
  success = signal<string | null>(null);

  ngOnInit(): void {
    this.authApi
      .me()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (info) => this.accountInfo.set(info),
        error: (err) => console.error(err),
      });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);
    const { currentPassword, newPassword } = this.form.getRawValue();
    this.authApi
      .changePassword(currentPassword, newPassword)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set(this.labels.successMessage);
          this.form.reset();
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(
            err.status === 400 ? this.labels.wrongCurrentPasswordError : this.labels.genericError,
          );
        },
      });
  }
}
