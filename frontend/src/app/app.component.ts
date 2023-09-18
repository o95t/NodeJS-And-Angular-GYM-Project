import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileDialogComponent } from './ui/user-profile-dialog.component';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span class="one" (click)="router.navigate([''])">Sugar Gyms</span>
      <div *ngIf="!authService.user(); else auth">
        <button mat-button class="m-2" [routerLink]="['', 'sign-in']">
          Sign in
        </button>
        <button mat-raised-button [routerLink]="['', 'sign-up']">
          Sign up
        </button>
      </div>
    </mat-toolbar>
    <ng-template #auth>
      <mat-icon (click)="handleOpenProfileDialog()">person</mat-icon>
      <mat-icon
        class="ml-2"
        [matBadge]="authService.requests().length"
        [matBadgeHidden]="authService.requests().length === 0"
        matBadgeColor="warn"
        [matMenuTriggerFor]="menu"
        >notifications</mat-icon
      >
      <button mat-button class="m-2" (click)="authService.signOut()">
        Sign out
      </button>
      <mat-menu #menu>
        <div class="fixed full-width" *ngIf="isLoading">
          <mat-progress-bar mode="indeterminate" />
        </div>
        <div *ngIf="authService.requests().length !== 0; else emptyRequests">
          <div
            *ngFor="
              let user of authService.requests();
              index as index;
              last as last
            "
          >
            <app-friend-request
              [user]="user"
              [index]="index"
              [isLoading]="isLoading"
            />
            <mat-divider *ngIf="!last" />
          </div>
        </div>
      </mat-menu>
      <ng-template #emptyRequests>
        <div class="ml-2 p-2">You have no pending friend requests!</div>
      </ng-template>
    </ng-template>
    <router-outlet />
  `,
  styles: [
    `
      mat-progress-bar {
        top: -8px;
      }
    `,
  ],
})
export class AppComponent {
  private dialog = inject(MatDialog);
  authService = inject(AuthService);
  router = inject(Router);
  isLoading = false;

  handleOpenProfileDialog() {
    this.dialog.open(UserProfileDialogComponent, {
      data: { user: this.authService.user() },
    });
  }
}
