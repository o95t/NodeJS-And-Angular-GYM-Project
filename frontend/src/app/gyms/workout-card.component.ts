import { Component, Input, OnInit, inject } from '@angular/core';
import IWorkout from './types/workout.interface';
import IGym from './types/gym.interface';
import { Subscription, catchError, throwError } from 'rxjs';
import { GymsService } from './services/gyms.service';

@Component({
  selector: 'app-workout-card',
  template: `
    <mat-card>
      <mat-card-content>
        <img [src]="workout.image" alt="gym" />

        <div class="flex column  mt-3">
          <h3>{{ workout.name | titlecase }}</h3>
          <label
            class="one-line"
            [matTooltip]="workout.description"
            matTooltipPosition="above"
          >
            {{ workout.description }}
          </label>
          <mat-checkbox [disabled]="true" color="primary" [checked]="isActive"
            >Active</mat-checkbox
          >
        </div>

        <div class="flex justify-end">
          <button
            mat-raised-button
            color="primary"
            [disabled]="isActive || isLoading"
            (click)="handleSetActive()"
          >
            Activate
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        width: 250px;
      }

      img {
        width: 100%;
        height: 150px;
        object-fit: contain;
      }

      @media screen and (max-width: 480px) {
        mat-card {
          width: 100%;
        }
      }
    `,
  ],
})
export class WorkoutCardComponent {
  @Input({ required: true }) workout!: IWorkout;
  @Input({ required: true }) gym!: IGym;
  @Input({ required: true }) isActive!: boolean;
  private gymsService = inject(GymsService);
  isLoading = false;
  setActiveWorkoutSub: Subscription | null = null;

  handleSetActive() {
    this.isLoading = true;
    this.setActiveWorkoutSub?.unsubscribe();
    this.setActiveWorkoutSub = this.gymsService
      .setActiveWorkout(this.gym._id, this.workout._id)
      .pipe(
        catchError(() => {
          this.isLoading = false;
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res) => {
        this.isLoading = false;
        if (res.success) {
          this.gym.activeWorkout = this.workout;
        }
      });
  }

  ngOnDestroy() {
    this.setActiveWorkoutSub?.unsubscribe();
  }
}
