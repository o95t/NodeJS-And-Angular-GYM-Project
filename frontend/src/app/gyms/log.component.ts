import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  WritableSignal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { UserProfileDialogComponent } from '../ui/user-profile-dialog.component';
import { GymsService } from './services/gyms.service';
import ILog from './types/log.interface';

@Component({
  selector: 'app-log',
  template: `
    <div class="flex column max-width-450">
      <div class="flex">
        <app-user-avatar
          class="p-1 mr-2"
          [user]="log.createdBy"
          (click)="handleOpenProfile()"
        />
        <mat-form-field>
          <textarea
            matInput
            type="text"
            class="black"
            [disabled]="true"
            [value]="log.comment"
          ></textarea>
        </mat-form-field>
      </div>
      <div class="flex justify-end mb-2" *ngIf="isUser">
        <button
          mat-raised-button
          type="submit"
          color="warn"
          (click)="handleDeleteLog()"
        >
          Delete
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class LogComponent implements OnInit, OnDestroy {
  @Input({ required: true }) workoutId!: string;
  @Input({ required: true }) gymId!: string;
  @Input({ required: true }) log!: ILog;
  private authService = inject(AuthService);
  private gymsService = inject(GymsService);
  private dialog = inject(MatDialog);
  isUser = false;
  deleteLog: Subscription | null = null;

  handleOpenProfile() {
    this.dialog.open(UserProfileDialogComponent, {
      data: { user: { ...this.log.createdBy, _id: this.log.createdBy.userId } },
    });
  }

  handleDeleteLog() {
    this.deleteLog?.unsubscribe();
    this.deleteLog = this.gymsService
      .deleteLog(this.gymId, this.workoutId, this.log._id)
      .subscribe((res) => {
        if (res.success) {
          const { activeWorkoutLogs } = this.gymsService;
          activeWorkoutLogs.set(
            activeWorkoutLogs().filter(({ _id }) => _id !== this.log._id)
          );
        }
      });
  }

  ngOnInit() {
    this.isUser = this.log.createdBy.userId === this.authService.user()?._id;
  }

  ngOnDestroy() {
    this.deleteLog?.unsubscribe();
  }
}
