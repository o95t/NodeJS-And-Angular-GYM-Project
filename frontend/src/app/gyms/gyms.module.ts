import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UIModule } from '../ui/ui.module';
import { AddGymDialogComponent } from './add-gym-dialog.component';
import { AddWorkoutDialogComponent } from './add-workout-dialog.component';
import { GymAvatarComponent } from './gym-avatar.component';
import { GymCardComponent } from './gym-card.component';
import { GymDetailsComponent } from './gym-details.component';
import { GymsRoutingModule } from './gyms-routing.module';
import { GymsComponent } from './gyms.component';
import { WorkoutCardComponent } from './workout-card.component';
import { WorkoutComponent } from './workout.component';
import { AddLogComponent } from './add-log.component';
import { LogComponent } from './log.component';

@NgModule({
  declarations: [
    GymCardComponent,
    AddGymDialogComponent,
    GymsComponent,
    GymDetailsComponent,
    GymAvatarComponent,
    WorkoutComponent,
    AddWorkoutDialogComponent,
    WorkoutCardComponent,
    AddLogComponent,
    LogComponent,
  ],
  imports: [
    CommonModule,
    UIModule,
    ReactiveFormsModule,
    GymsRoutingModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatDividerModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTooltipModule,
  ],
})
export class GymsModule {}
