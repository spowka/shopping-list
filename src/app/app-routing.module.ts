import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/shopping-list',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    loadChildren: () =>
      import('./components/sign-in').then((m) => m.SignInModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./components/sign-up').then((m) => m.SignUpModule),
  },
  {
    path: 'shopping-list',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/shopping-list').then((m) => m.ShoppingListModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
