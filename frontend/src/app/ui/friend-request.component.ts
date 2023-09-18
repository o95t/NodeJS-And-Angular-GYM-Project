import { Component, Input, OnDestroy, inject } from '@angular/core';
import IUser from '../types/user.interface';
import { Subscription, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-friend-request',
  template: `
    <div class="p-3 flex align-center" (click)="$event.stopPropagation()">
      <app-user-avatar [user]="user" [isNameHidden]="true" />
      <div class="flex column ml-2">
        {{ user.fullName | titlecase }} has sent you a friend request!
        <div class="flex justify-between">
          <button
            mat-raised-button
            class="mt-1"
            color="primary"
            [disabled]="isLoading"
            (click)="handleFriendRequest(true)"
          >
            Accept
          </button>
          <button
            mat-raised-button
            class="mt-1"
            color="warn"
            [disabled]="isLoading"
            (click)="handleFriendRequest(false)"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class FriendRequestComponent implements OnDestroy {
  @Input({ required: true }) user!: IUser;
  @Input({ required: true }) index!: number;
  @Input() isLoading = false;
  private authService = inject(AuthService);
  updateFriendRequestSub: Subscription | null = null;

  handleFriendRequest(isAccepted: boolean) {
    this.isLoading = true;
    this.updateFriendRequestSub?.unsubscribe();
    this.updateFriendRequestSub = this.authService
      .updateFriendRequest({ ...this.user, isAccepted })
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
          if (isAccepted) {
            const temp = [...this.authService.friends()];
            temp.push(this.user);
            this.authService.friends.set(temp);
          }
          const temp = this.authService
            .requests()
            .filter(({ _id }) => _id !== this.user._id);
          this.authService.requests.set(temp);
        }
      });
  }

  ngOnDestroy() {
    this.updateFriendRequestSub?.unsubscribe();
  }
}
