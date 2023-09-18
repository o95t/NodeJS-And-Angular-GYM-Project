import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, Subscription, throwError } from 'rxjs';

import IGym from '../gyms/types/gym.interface';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import IUser from '../types/user.interface';

@Component({
  selector: 'app-user-profile-dialog',
  template: `
    <div class="relative width-300">
      <div class="fixed width-300" *ngIf="isLoading">
        <mat-progress-bar mode="indeterminate" />
      </div>
      <div class="relative flex column p-4">
        <img
          class="align-self-center"
          [src]="avatar || '/assets/images/user.jpg'"
          [alt]="data.user.fullName"
          (click)="isUser ? fileInput.click() : null"
        />
        <mat-icon
          *ngIf="isUser"
          class="absolute right p-4"
          color="primary"
          (click)="fileInput.click()"
          >edit</mat-icon
        >
      </div>
      <mat-dialog-content>
        <h3 class="black">{{ data.user.fullName | titlecase }}</h3>
        <h3 class="info">{{ data.user.email }}</h3>

        <div *ngIf="friends.length" class="mt-2">
          <span class="black">Friends ({{ friends.length }})</span>
          <div class="flex horizontal-snap gap-4 mt-2 mb-2 p-2">
            <app-user-avatar *ngFor="let friend of friends" [user]="friend" />
          </div>
        </div>
      </mat-dialog-content>

      <input
        hidden
        #fileInput
        type="file"
        accept="image/*"
        (change)="handleImageChange($event)"
      />
      <mat-divider />
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Close</button>
        <button
          *ngIf="!isUser"
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="isLoading || button !== 'Add Friend'"
          (click)="handleSendFriendRequest()"
        >
          {{ button }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
      }

      mat-progress-bar {
        overflow: hidden;
      }
    `,
  ],
})
export class UserProfileDialogComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  data: { user: IUser; gym?: IGym } = inject(MAT_DIALOG_DATA);
  isLoading = false;
  avatar: string | null = null;
  image = '';
  button = 'Add Friend';
  isUser = false;
  friends: IUser[] = [];
  imageSource: File | null = null;
  getUserSub: Subscription | null = null;
  addFriendSub: Subscription | null = null;
  changeAvatarSub: Subscription | null = null;

  constructor() {
    this.isLoading = true;
    this.usersService
      .getFriends(this.data.user._id)
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
          this.friends = res.data;
        }
      });
  }

  handleImageChange(event: Event) {
    if (this.isLoading) {
      event.preventDefault();
    }
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      this.image = target.files[0].name;
      this.imageSource = target.files[0];
      this.handleUploadImage();
    }
  }

  handleUploadImage() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('image', this.imageSource!, this.image);
    this.changeAvatarSub?.unsubscribe();
    this.changeAvatarSub = this.authService
      .changeAvatar(formData)
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
          this.authService.user.set({
            ...this.authService.user()!,
            avatar: res.data,
          });
          this.avatar = res.data;
          this.authService.saveUser();
          if (this.data.gym) {
            const member = this.data.gym.members.find(
              ({ _id }) => _id === this.data.user._id
            );
            if (member) {
              member.avatar = res.data;
            }
          }
        }
      });
  }

  handleSendFriendRequest() {
    this.isLoading = true;
    this.addFriendSub?.unsubscribe();
    this.addFriendSub = this.authService
      .sendFriendRequest(this.data.user)
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
          const temp = [...this.authService.sentRequests()];
          temp.push(this.data.user);
          this.authService.sentRequests.set(temp);
          this.button = 'Sent';
        }
      });
  }

  ngOnInit() {
    const { user } = this.data;
    this.isUser = this.authService.user()!._id === user._id;
    this.avatar = user.avatar || null;
    if (!this.isUser) {
      switch (true) {
        case this.authService.friends().some(({ _id }) => _id === user._id):
          this.button = 'Friends';
          break;
        case this.authService
          .sentRequests()
          .some(({ _id }) => _id === user._id):
          this.button = 'Sent';
          break;
        default:
          break;
      }
    }
  }

  ngOnDestroy() {
    this.addFriendSub?.unsubscribe();
    this.changeAvatarSub?.unsubscribe();
  }
}
