import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GymDetailsComponent } from './gym-details.component';
import { GymsComponent } from './gyms.component';
import { WorkoutComponent } from './workout.component';

const routes: Routes = [
  {
    path: '',
    component: GymsComponent,
    pathMatch: 'full',
  },
  {
    path: ':id',
    component: GymDetailsComponent,
  },
  {
    path: ':id/active-workout',
    component: WorkoutComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GymsRoutingModule {}
