import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthApi } from '../core/auth/auth.api';
import { VERIFY_EMAIL_LABELS } from '../core/i18n/verify-email.labels';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailComponent implements OnInit {
  private authApi = inject(AuthApi);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  readonly labels = VERIFY_EMAIL_LABELS;

  state = signal<'loading' | 'success' | 'error'>('loading');

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.state.set('error');
      return;
    }
    this.authApi
      .verifyEmail(token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.state.set('success'),
        error: () => this.state.set('error'),
      });
  }
}
