import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../core/auth/auth.service';
import { HEADER_LABELS } from '../core/i18n/header.labels';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly labels = HEADER_LABELS;
  readonly isAdmin = computed(() => this.authService.userRole() === 'ADMIN');

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
