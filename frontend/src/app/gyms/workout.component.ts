import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';

import { GymsService } from './services/gyms.service';
import ILog from './types/log.interface';
import IWorkout from './types/workout.interface';

@Component({
  selector: 'app-workout',
  template: `
    <div class="fixed full-width" *ngIf="isLoading">
      <mat-progress-bar mode="indeterminate" />
    </div>
    <div *ngIf="workout" class="screen-margin flex column pb-4">
      <div class="flex align-center justify-between">
        <div class="flex align-center">
          <mat-icon class="m-2" (click)="router.navigate(['', 'gyms', this.id])"
            >arrow_backward</mat-icon
          >
          <h2 class="remove-margin">{{ workout.name | titlecase }}</h2>
        </div>
      </div>
      <mat-divider />

      <div class="flex column mt-2">
        <img [src]="workout.image" alt="gym" />
        <div class="mt-3 mb-3">
          <h2 class="remove-margin">Description</h2>
          <mat-divider class="max-width-150 p-1" />
          <p class="info">{{ workout.description }}</p>
        </div>

        <div>
          <h2 class="remove-margin">Logs</h2>
          <mat-divider class="max-width-100 p-2" />
          <div class="flex column">
            <app-log
              *ngFor="let log of gymsService.activeWorkoutLogs()"
              [log]="log"
              [gymId]="id"
              [workoutId]="this.workout._id"
            />
            <app-add-log [gymId]="id" [workoutId]="this.workout._id" />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      img {
        width: 450px;
        height: 100%;
        border-radius: 12px;
        object-fit: contain;
      }

      @media screen and (max-width: 480px) {
        img {
          width: 100%;
        }
      }
    `,
  ],
})
export class WorkoutComponent {
  private activeRoute = inject(ActivatedRoute);
  private title = inject(Title);
  gymsService = inject(GymsService);
  router = inject(Router);
  id = '';
  isLoading = false;
  logs: ILog[] = [];
  workout: IWorkout | null = null;
  getWorkoutSub: Subscription | null = null;

  constructor() {
    this.title.setTitle('Workout');
  }

  getData() {
    this.isLoading = true;
    this.getWorkoutSub?.unsubscribe();
    this.getWorkoutSub = this.gymsService
      .getActiveWorkout(this.id)
      .pipe(
        catchError(() => {
          this.isLoading = false;
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res) => {
        if (res.success) {
          this.isLoading = false;
          this.workout = res.data;
          if (res.data) {
            this.gymsService.activeWorkoutLogs.set(res.data.logs);
            this.title.setTitle(`Workout - ${res.data.name}`);
          }
        } else {
          this.router.navigate(['../']);
        }
      });
  }

  ngOnInit() {
    this.id = this.activeRoute.snapshot.paramMap.get('id') as string;
    this.getData();
  }

  ngOnDestroy() {
    this.getWorkoutSub?.unsubscribe();
  }
}
