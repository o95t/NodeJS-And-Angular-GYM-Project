import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { catchError, throwError } from 'rxjs';

import { AddGymDialogComponent } from './add-gym-dialog.component';
import { GymsService } from './services/gyms.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-gyms',
  template: `
    <div class="fixed full-width" *ngIf="isLoading">
      <mat-progress-bar mode="indeterminate" />
    </div>
    <div class="screen-margin flex column pb-4">
      <div *ngIf="authService.user()!.gyms.length">
        <div class="flex justify-between align-center mb-2">
          <h2>My Gyms</h2>
        </div>
        <mat-divider />
        <div
          class="flex horizontal-snap gap-4 mt-2 mb-2 p-2"
          *ngIf="authService.user()!.gyms.length; else emptyGyms"
        >
          <app-gym-avatar
            *ngFor="let gym of authService.user()!.gyms"
            [gym]="gym"
          />
        </div>
      </div>

      <div class="flex justify-between align-center mb-2">
        <h2>Gyms</h2>
        <button mat-fab color="basic" (click)="openAddGymDialog()">
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <mat-divider />
      <div
        class="gap-4 grid mt-2"
        *ngIf="gymsService.gyms().length; else emptyGyms"
      >
        <app-gym-card *ngFor="let gym of gymsService.gyms()" [gym]="gym" />
      </div>
    </div>
    <ng-template #emptyGyms>
      <div *ngIf="!isLoading" class="mt-2">
        <h1 class="text-center">There is no gyms listed yet!</h1>
      </div>
    </ng-template>
  `,
  styles: [],
})
export class GymsComponent {
  private title = inject(Title);
  private dialog = inject(MatDialog);
  authService = inject(AuthService);
  gymsService = inject(GymsService);
  isLoading = false;

  constructor() {
    this.title.setTitle('Gyms');
    this.isLoading = true;
    this.gymsService
      .getGyms()
      .pipe(
        takeUntilDestroyed(),
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
          this.gymsService.gyms.set(res.data);
        }
      });
  }

  openAddGymDialog() {
    this.dialog.open(AddGymDialogComponent);
  }
}
