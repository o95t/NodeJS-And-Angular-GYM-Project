import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { GymsService } from './services/gyms.service';
import IGym from './types/gym.interface';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileDialogComponent } from '../ui/user-profile-dialog.component';
import IUser from '../types/user.interface';
import { AddWorkoutDialogComponent } from './add-workout-dialog.component';

@Component({
  selector: 'app-gym-details',
  template: `
    <div class="fixed full-width" *ngIf="isLoading">
      <mat-progress-bar mode="indeterminate" />
    </div>
    <div *ngIf="gym" class="screen-margin flex column pb-4">
      <div class="flex align-center justify-between">
        <div class="flex align-center">
          <mat-icon class="m-2" (click)="router.navigate(['../'])"
            >arrow_backward</mat-icon
          >
          <h2 class="remove-margin">{{ gym.name | titlecase }}</h2>
        </div>
        <div class="flex align-center m-2">
          <button
            mat-raised-button
            *ngIf="gym.activeWorkout"
            class="align-self-end mr-2"
            [disabled]="isLoading"
            color="primary"
            (click)="router.navigate(['', 'gyms', gym._id, 'active-workout'])"
          >
            Workout
          </button>
          <button
            mat-raised-button
            *ngIf="!isOwner; else owner"
            class="align-self-end "
            [disabled]="isLoading"
            color="primary"
            (click)="handleJoinOrLeave()"
          >
            {{ isMember ? 'Leave' : 'Join' }}
          </button>
        </div>

        <ng-template #owner>
          <button
            mat-raised-button
            class="align-self-end"
            [disabled]="isLoading"
            color="warn"
            (click)="handleDelete()"
          >
            Delete
          </button>
        </ng-template>
      </div>
      <mat-divider />

      <div class="flex justify-center mt-2">
        <img [src]="gym.image" alt="gym" />
      </div>
      <div class="mt-2">
        <div class="flex justify-between align-center">
          <h3>Members ({{ gym.members.length || 0 }})</h3>
        </div>
      </div>
      <div class="mt-2">
        <div
          class="flex horizontal-snap gap-4 mt-2 mb-2 p-2"
          *ngIf="(gym?.members)!.length"
        >
          <app-user-avatar
            class="align-center card-container"
            *ngFor="let member of gym!.members"
            [user]="member"
            (click)="handleOpenProfileDialog(member)"
          />
        </div>
      </div>

      <div *ngIf="isOwner" class="mt-2">
        <div class="flex justify-between align-center mb-2">
          <h2>Workouts</h2>
          <button mat-fab color="basic" (click)="handleOpenAddWorkoutDialog()">
            <mat-icon>add</mat-icon>
          </button>
        </div>
        <mat-divider />
        <div
          class="grid gap-4 mt-2 mb-2 p-2"
          *ngIf="gym.workouts.length; else emptyWorkouts"
        >
          <app-workout-card
            *ngFor="let workout of gym.workouts"
            [workout]="workout"
            [gym]="gym"
            [isActive]="workout._id === gym.activeWorkout?._id"
          />
        </div>

        <ng-template #emptyWorkouts>
          <div *ngIf="!isLoading" class="mt-2">
            <h1 class="text-center">You didn't add any workouts yet!</h1>
          </div>
        </ng-template>
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
export class GymDetailsComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private gymsService = inject(GymsService);
  private activeRoute = inject(ActivatedRoute);
  private title = inject(Title);
  private dialog = inject(MatDialog);
  router = inject(Router);
  id = '';
  isLoading = false;
  isMember = false;
  isOwner = false;
  gym: IGym | null = null;
  getGymSub: Subscription | null = null;
  joinGymSub: Subscription | null = null;
  leaveGymSub: Subscription | null = null;
  deleteGymSub: Subscription | null = null;

  constructor() {
    this.title.setTitle('Gym');
  }

  handleOpenProfileDialog(user: IUser) {
    this.dialog.open(UserProfileDialogComponent, {
      data: { user, gym: this.gym },
    });
  }

  handleOpenAddWorkoutDialog() {
    this.dialog.open(AddWorkoutDialogComponent, {
      data: this.gym,
    });
  }

  handleJoinOrLeave() {
    if (this.isMember) {
      this.handleLeave();
    } else {
      this.handleJoin();
    }
  }

  handleJoin() {
    this.isLoading = true;
    this.joinGymSub?.unsubscribe();
    this.joinGymSub = this.authService
      .joinGym(this.gym!)
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
          const temp = [...this.authService.user()!.gyms];
          temp.push(this.gym!);
          this.authService.user.set({
            ...this.authService.user()!,
            gyms: temp,
          });
          this.gym!.members.push(this.authService.user()!);
          this.authService.saveUser();
          this.isMember = true;
        }
      });
  }

  handleLeave() {
    this.isLoading = true;
    this.leaveGymSub?.unsubscribe();
    this.leaveGymSub = this.authService
      .leaveGym(this.gym!._id)
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
          const temp = this.authService
            .user()!
            .gyms.filter(({ _id }) => _id !== this.gym!._id);
          this.authService.user.set({
            ...this.authService.user()!,
            gyms: temp,
          });
          this.gym!.members = this.gym!.members.filter(
            ({ _id }) => _id !== this.authService.user()!._id
          );
          this.authService.saveUser();
          this.isMember = false;
        }
      });
  }

  handleDelete() {
    this.isLoading = true;
    this.deleteGymSub?.unsubscribe();
    this.deleteGymSub = this.gymsService
      .deleteGym(this.gym!._id)
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
          const temp = this.authService
            .user()!
            .gyms.filter(({ _id }) => _id !== this.gym!._id);
          this.authService.user.set({
            ...this.authService.user()!,
            gyms: temp,
          });
          this.authService.saveUser();
          this.router.navigate(['', 'gyms']);
        }
      });
  }

  getData() {
    this.isLoading = true;
    this.getGymSub?.unsubscribe();
    this.getGymSub = this.gymsService
      .getGym(this.id)
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
          this.gym = res.data;
          this.title.setTitle(`Gym - ${res.data.name}`);
          this.isMember = this.authService
            .user()!
            .gyms.some(({ _id }) => _id === res.data._id);
          this.isOwner =
            this.gym.createdBy?.userId === this.authService.user()?._id;
        } else {
          this.router.navigate(['', 'gyms']);
        }
      });
  }

  ngOnInit() {
    this.id = this.activeRoute.snapshot.paramMap.get('id') as string;
    this.getData();
  }

  ngOnDestroy() {
    this.getGymSub?.unsubscribe();
    this.joinGymSub?.unsubscribe();
    this.leaveGymSub?.unsubscribe();
    this.deleteGymSub?.unsubscribe();
  }
}
