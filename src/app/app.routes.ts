import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'drugs',
    loadComponent: () =>
      import('./drugs-view/drugs-view').then((m) => m.DrugsView),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'admin/users',
    loadComponent: () =>
      import('./admin/create-user/create-user').then((m) => m.CreateUserComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'formulas',
    loadComponent: () =>
      import('./formulas-view/formulas-view').then((m) => m.FormulasView),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'drugs', pathMatch: 'full' },
  { path: '**', redirectTo: 'drugs' },
];
