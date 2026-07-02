import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserApi } from '../../core/admin/user.api';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './create-user.html',
})
export class CreateUserComponent {
  private userApi = inject(UserApi);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['USER' as 'ADMIN' | 'USER', Validators.required],
  });

  error = signal<string | null>(null);
  loading = signal(false);
  success = signal<string | null>(null);

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);
    const { email, password, role } = this.form.getRawValue();
    this.userApi
      .createUser({ email, password, role })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.loading.set(false);
          this.success.set(`Utilisateur ${user.email} créé.`);
          this.form.reset({ role: 'USER' });
        },
        error: () => {
          this.error.set("Erreur lors de la création de l'utilisateur.");
          this.loading.set(false);
        },
      });
  }
}
