import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { checkTokenGuard } from './check-token.guard';
import { SignInComponent } from './sign-in.component';
import { SignUpComponent } from './sign-up.component';

const routes: Routes = [
  {
    path: 'gyms',
    loadChildren: () => import('./gyms/gyms.module').then((m) => m.GymsModule),
    canActivate: [checkTokenGuard],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'gyms',
  },
  {
    path: '',
    redirectTo: 'gyms',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
